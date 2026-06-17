import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC20_jrtEb3xK12HHmgrhXuNvt8bNNjc-c",
  authDomain: "chessecakehouse.firebaseapp.com",
  projectId: "chessecakehouse",
  storageBucket: "chessecakehouse.firebasestorage.app",
  messagingSenderId: "334625101985",
  appId: "1:334625101985:web:358e1f74f6f2b6b7e38e0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize or retrieve Auth instance
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

// Export Firestore
export const db = getFirestore(app);

export { auth };
export default app;
