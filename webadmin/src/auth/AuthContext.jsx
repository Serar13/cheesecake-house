import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { COLLECTIONS } from "../services/collections";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase auth user
  const [profile, setProfile] = useState(null); // Firestore users/{uid} doc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setError(null);
      if (!fbUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(fbUser);
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.USERS, fbUser.uid));
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } catch (err) {
        console.error("Failed to load admin profile:", err);
        setProfile(null);
        setError("Nu am putut încărca profilul utilizatorului.");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    setError(null);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const isAdmin = !!profile && profile.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, error, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
