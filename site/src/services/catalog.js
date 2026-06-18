// Read-side catalog service. Firestore is the source of truth.
// All getters return [] on failure (errors logged to console) so the UI never crashes.
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from './collections';

// Normalize a Firestore product doc into the shape the UI components expect.
// The legacy UI reads `image`; Firestore stores `imageUrl`. Keep both available.
function normalizeProduct(id, data) {
  return {
    id,
    ...data,
    // image is what ProductCard / CartSidebar render; fall back to imageUrl.
    image: data.imageUrl || data.image || '',
  };
}

function withId(snapshot) {
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function bySortOrder(a, b) {
  return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
}

// ---- One-shot read cache ---------------------------------------------------
// Memoize get* reads for a short window so that data prefetched during the
// intro splash is reused instantly by the page components (no refetch, no
// pop-in). Live updates are handled separately by the subscribe* variants.
const READ_TTL_MS = 5 * 60 * 1000;
const _readCache = new Map();

function memoRead(key, fetcher) {
  const entry = _readCache.get(key);
  if (entry && Date.now() - entry.ts < READ_TTL_MS) return entry.promise;

  const promise = fetcher()
    .then((result) => {
      // Don't cache empty results — they usually signal a transient failure,
      // so a later call gets a fresh chance to succeed.
      if (Array.isArray(result) && result.length === 0) _readCache.delete(key);
      return result;
    })
    .catch((error) => {
      _readCache.delete(key);
      throw error;
    });

  _readCache.set(key, { promise, ts: Date.now() });
  return promise;
}

// Drop cached reads (e.g. to force-refresh after a known data change).
export function clearCatalogCache() {
  _readCache.clear();
}

// ---- Categories ------------------------------------------------------------
export async function getActiveCategories() {
  return memoRead('categories', async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.CATEGORIES),
        where('active', '==', true)
      );
      const snap = await getDocs(q);
      return withId(snap).sort(bySortOrder);
    } catch (error) {
      console.error('getActiveCategories failed:', error);
      return [];
    }
  });
}

export function subscribeActiveCategories(callback, onError) {
  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('active', '==', true)
    );
    return onSnapshot(
      q,
      (snap) => callback(withId(snap).sort(bySortOrder)),
      (error) => {
        console.error('subscribeActiveCategories failed:', error);
        if (onError) onError(error);
        callback([]);
      }
    );
  } catch (error) {
    console.error('subscribeActiveCategories failed:', error);
    callback([]);
    return () => {};
  }
}

// ---- Products --------------------------------------------------------------
// Fetch active products ordered by sortOrder. Availability is NOT filtered at
// the query level — the UI decides how to display unavailable items.
export async function getActiveProducts() {
  return memoRead('products', async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('active', '==', true)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => normalizeProduct(d.id, d.data())).sort(bySortOrder);
    } catch (error) {
      console.error('getActiveProducts failed:', error);
      return [];
    }
  });
}

export function subscribeActiveProducts(callback, onError) {
  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('active', '==', true)
    );
    return onSnapshot(
      q,
      (snap) => callback(snap.docs.map((d) => normalizeProduct(d.id, d.data())).sort(bySortOrder)),
      (error) => {
        console.error('subscribeActiveProducts failed:', error);
        if (onError) onError(error);
        callback([]);
      }
    );
  } catch (error) {
    console.error('subscribeActiveProducts failed:', error);
    callback([]);
    return () => {};
  }
}

// ---- Promotions ------------------------------------------------------------
export async function getActivePromotions() {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROMOTIONS),
      where('active', '==', true)
    );
    const snap = await getDocs(q);
    return withId(snap);
  } catch (error) {
    console.error('getActivePromotions failed:', error);
    return [];
  }
}

// ---- Locations -------------------------------------------------------------
export async function getActiveLocations() {
  try {
    const q = query(
      collection(db, COLLECTIONS.LOCATIONS),
      where('active', '==', true)
    );
    const snap = await getDocs(q);
    return withId(snap);
  } catch (error) {
    console.error('getActiveLocations failed:', error);
    return [];
  }
}

export function subscribeActiveLocations(callback, onError) {
  try {
    const q = query(
      collection(db, COLLECTIONS.LOCATIONS),
      where('active', '==', true)
    );
    return onSnapshot(
      q,
      (snap) => callback(withId(snap)),
      (error) => {
        console.error('subscribeActiveLocations failed:', error);
        if (onError) onError(error);
        callback([]);
      }
    );
  } catch (error) {
    console.error('subscribeActiveLocations failed:', error);
    callback([]);
    return () => {};
  }
}

// ---- Reviews ---------------------------------------------------------------
export async function getApprovedReviews() {
  return memoRead('reviews', async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.REVIEWS),
        where('approved', '==', true)
      );
      const snap = await getDocs(q);
      return withId(snap);
    } catch (error) {
      console.error('getApprovedReviews failed:', error);
      return [];
    }
  });
}

export function subscribeApprovedReviews(callback, onError) {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('approved', '==', true)
    );
    return onSnapshot(
      q,
      (snap) => callback(withId(snap)),
      (error) => {
        console.error('subscribeApprovedReviews failed:', error);
        if (onError) onError(error);
        callback([]);
      }
    );
  } catch (error) {
    console.error('subscribeApprovedReviews failed:', error);
    callback([]);
    return () => {};
  }
}
