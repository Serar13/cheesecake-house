import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// The Firebase web config is safe to ship in client apps; access is protected
// by Firebase Auth + Firestore security rules (see ../../site/firestore.rules).
const firebaseConfig = {
  apiKey: "AIzaSyC20_jrtEb3xK12HHmgrhXuNvt8bNNjc-c",
  authDomain: "chessecakehouse.firebaseapp.com",
  projectId: "chessecakehouse",
  storageBucket: "chessecakehouse.firebasestorage.app",
  messagingSenderId: "334625101985",
  appId: "1:334625101985:web:358e1f74f6f2b6b7e38e0",
  measurementId: "G-F3CQCDWQVZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
