import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from './collections';

// Map a Firestore document snapshot into a plain object with its id.
const mapDoc = (d) => ({ id: d.id, ...d.data() });

// Run a query and return an array of mapped docs. Returns [] on error.
// If an orderBy on a missing index/field fails, retries without ordering.
const runQuery = async (collectionName, constraints = [], { sortKey } = {}) => {
  try {
    const q = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : query(collection(db, collectionName));
    const snap = await getDocs(q);
    let rows = snap.docs.map(mapDoc);
    // Client-side stable sort fallback (covers docs missing the sort field).
    if (sortKey) {
      rows = rows.sort((a, b) => (a[sortKey] ?? 0) - (b[sortKey] ?? 0));
    }
    return rows;
  } catch (err) {
    console.error(`[firestore] query ${collectionName} failed:`, err);
    // Retry without ordering constraints (common cause: missing composite index).
    try {
      const snap = await getDocs(collection(db, collectionName));
      let rows = snap.docs
        .map(mapDoc)
        .filter((row) =>
          constraints
            .filter((c) => c?.type === 'where')
            .every(() => true)
        );
      return rows;
    } catch (err2) {
      console.error(`[firestore] fallback query ${collectionName} failed:`, err2);
      return [];
    }
  }
};

export const getActiveProducts = async () => {
  const rows = await runQuery(
    COLLECTIONS.PRODUCTS,
    [where('active', '==', true), orderBy('sortOrder', 'asc')],
    { sortKey: 'sortOrder' }
  );
  // Defensive: ensure active only, in case the fallback path skipped the filter.
  return rows.filter((p) => p.active !== false);
};

export const getActiveCategories = async () => {
  const rows = await runQuery(
    COLLECTIONS.CATEGORIES,
    [where('active', '==', true), orderBy('sortOrder', 'asc')],
    { sortKey: 'sortOrder' }
  );
  return rows.filter((c) => c.active !== false);
};

export const getActivePromotions = async () => {
  const rows = await runQuery(
    COLLECTIONS.PROMOTIONS,
    [where('active', '==', true)]
  );
  return rows.filter((p) => p.active !== false);
};

export const getActiveLocations = async () => {
  const rows = await runQuery(
    COLLECTIONS.LOCATIONS,
    [where('active', '==', true)]
  );
  return rows.filter((l) => l.active !== false);
};

export const getTablesByLocation = async (locationId) => {
  if (!locationId) return [];
  const rows = await runQuery(
    COLLECTIONS.TABLES,
    [where('locationId', '==', locationId)]
  );
  return rows.filter((t) => t.locationId === locationId && t.active !== false);
};

export const getUserReservations = async (uid) => {
  if (!uid) return [];
  const rows = await runQuery(
    COLLECTIONS.RESERVATIONS,
    [where('userId', '==', uid)]
  );
  return rows.filter((r) => r.userId === uid);
};

export const createOrder = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  } catch (err) {
    console.error('[firestore] createOrder failed:', err);
    return null;
  }
};

export const createReservation = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTIONS.RESERVATIONS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  } catch (err) {
    console.error('[firestore] createReservation failed:', err);
    return null;
  }
};

// Returns true if an existing non-cancelled reservation already holds this
// table at the given date/time. Returns false on error (do not block booking).
export const checkReservationConflict = async ({ tableId, date, time }) => {
  if (!tableId || !date || !time) return false;
  try {
    const q = query(
      collection(db, COLLECTIONS.RESERVATIONS),
      where('tableId', '==', tableId),
      where('date', '==', date),
      where('time', '==', time)
    );
    const snap = await getDocs(q);
    return snap.docs.some((d) => {
      const status = d.data().status;
      return status !== 'cancelled';
    });
  } catch (err) {
    console.error('[firestore] checkReservationConflict failed:', err);
    return false;
  }
};

export default {
  getActiveProducts,
  getActiveCategories,
  getActivePromotions,
  getActiveLocations,
  getTablesByLocation,
  getUserReservations,
  createOrder,
  createReservation,
  checkReservationConflict
};
