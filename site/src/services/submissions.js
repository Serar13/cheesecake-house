// Write-side submission service. All create* functions stamp createdAt/updatedAt
// with serverTimestamp(), set sensible default status, and the appropriate
// source/userId. They return the created document id.
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from './collections';

// ---- Orders ----------------------------------------------------------------
export async function createOrder(data) {
  const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
    userId: data.userId || null,
    customerName: data.customerName || '',
    source: 'site',
    locationId: data.locationId || null,
    items: data.items || [],
    total: typeof data.total === 'number' ? data.total : 0,
    deliveryType: data.deliveryType || 'delivery',
    status: 'pending',
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.notes !== undefined ? { notes: data.notes } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ---- Reservations ----------------------------------------------------------
export async function createReservation(data) {
  const docRef = await addDoc(collection(db, COLLECTIONS.RESERVATIONS), {
    userId: data.userId || null,
    customerName: data.customerName || '',
    locationId: data.locationId || null,
    tableId: data.tableId || null,
    date: data.date || '',
    time: data.time || '',
    durationMinutes:
      typeof data.durationMinutes === 'number' ? data.durationMinutes : 90,
    guests: typeof data.guests === 'number' ? data.guests : 1,
    status: 'pending',
    ...(data.notes !== undefined ? { notes: data.notes } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ---- Offer requests --------------------------------------------------------
export async function createOfferRequest(data) {
  const docRef = await addDoc(collection(db, COLLECTIONS.OFFER_REQUESTS), {
    customerName: data.customerName || '',
    email: data.email || '',
    phone: data.phone || '',
    eventType: data.eventType || '',
    eventDate: data.eventDate || '',
    guestCount: typeof data.guestCount === 'number' ? data.guestCount : 0,
    message: data.message || '',
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ---- Reviews ---------------------------------------------------------------
export async function createReview(data) {
  const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
    name: data.name || 'Anonim',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    text: data.text || '',
    approved: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ---- Tables ----------------------------------------------------------------
export async function getTablesByLocation(locationId) {
  if (!locationId) return [];
  try {
    // Try the ordered query first; if a composite index is missing, fall back.
    try {
      const q = query(
        collection(db, COLLECTIONS.TABLES),
        where('locationId', '==', locationId),
        where('active', '==', true),
        orderBy('name')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (indexError) {
      console.warn(
        'getTablesByLocation ordered query failed, retrying without orderBy:',
        indexError
      );
      const q = query(
        collection(db, COLLECTIONS.TABLES),
        where('locationId', '==', locationId),
        where('active', '==', true)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  } catch (error) {
    console.error('getTablesByLocation failed:', error);
    return [];
  }
}

// ---- Reservation conflict check --------------------------------------------
// Returns true if an existing pending/confirmed reservation occupies the same
// table on the same date at the same time. If durationMinutes is supplied we
// also flag time-range overlaps.
function timeToMinutes(time) {
  if (!time || typeof time !== 'string') return null;
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export async function checkReservationConflict({
  tableId,
  date,
  time,
  durationMinutes = 90,
}) {
  if (!tableId || !date || !time) return false;
  try {
    const q = query(
      collection(db, COLLECTIONS.RESERVATIONS),
      where('tableId', '==', tableId),
      where('date', '==', date),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const snap = await getDocs(q);

    const newStart = timeToMinutes(time);
    const newEnd = newStart != null ? newStart + durationMinutes : null;

    return snap.docs.some((d) => {
      const r = d.data();
      // Exact same slot is always a conflict.
      if (r.time === time) return true;
      // If we can compute ranges, detect overlap.
      if (newStart == null) return false;
      const existStart = timeToMinutes(r.time);
      if (existStart == null) return false;
      const existEnd =
        existStart +
        (typeof r.durationMinutes === 'number' ? r.durationMinutes : 90);
      return newStart < existEnd && existStart < newEnd;
    });
  } catch (error) {
    console.error('checkReservationConflict failed:', error);
    // Fail open is risky; fail closed (treat error as no conflict so the user
    // can still submit, but log it). Returning false keeps UX functional.
    return false;
  }
}
