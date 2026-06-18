// Generic Firestore CRUD helpers used by every admin module. Keeping the data
// mapping in one place avoids duplicating collection names / serverTimestamp
// logic across the UI.
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// Subscribe to a whole collection (optionally ordered). Returns an unsubscribe fn.
// onData receives an array of { id, ...data }; onError receives the error.
export function subscribeCollection(name, { orderByField } = {}, onData, onError) {
  let ref = collection(db, name);
  if (orderByField) {
    try {
      ref = query(collection(db, name), orderBy(orderByField));
    } catch {
      ref = collection(db, name);
    }
  }
  return onSnapshot(
    ref,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error(`subscribeCollection(${name}) failed:`, err);
      onError?.(err);
    }
  );
}

export async function fetchCollection(name) {
  try {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`fetchCollection(${name}) failed:`, err);
    return [];
  }
}

// Create with an auto id, or with a caller-supplied id (e.g. slug).
export async function createDoc(name, data, id) {
  const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, name, id), payload);
    return id;
  }
  const ref = await addDoc(collection(db, name), payload);
  return ref.id;
}

export async function updateDocById(name, id, data) {
  await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocById(name, id) {
  await deleteDoc(doc(db, name, id));
}
