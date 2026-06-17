import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../mockData/translations';
import { subscribeActiveLocations } from '../services/catalog';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc
} from 'firebase/firestore';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cheesecake_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Locations are loaded from Firestore. selectedStore may be null until loaded.
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(() => {
    const savedStore = localStorage.getItem('cheesecake_store');
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Theme support (light default)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cheesecake_theme') || 'light';
  });

  // Language support (ro default)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('cheesecake_lang') || 'ro';
  });

  // Authentication support with Firebase
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('cheesecake_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem('cheesecake_store', JSON.stringify(selectedStore));
    }
  }, [selectedStore]);

  // Subscribe to active locations from Firestore. Keep the current selection if
  // it still exists; otherwise default to the first active location.
  useEffect(() => {
    const unsubscribe = subscribeActiveLocations((locs) => {
      setLocations(locs);
      setLocationsLoading(false);
      setSelectedStore((prev) => {
        if (prev && locs.some((l) => l.id === prev.id)) {
          // Refresh with the latest data for the same id.
          return locs.find((l) => l.id === prev.id);
        }
        return locs.length > 0 ? locs[0] : null;
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('cheesecake_theme', theme);
    // Apply class to HTML element for easy styling targeting
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cheesecake_lang', language);
  }, [language]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const balance = userData.balance !== undefined ? userData.balance : 150.0;
            const vipPoints = userData.vipPoints !== undefined ? userData.vipPoints : 120;
            const stamps = userData.stamps !== undefined ? userData.stamps : 4;
            const birthdayVoucherActive = userData.birthdayVoucherActive !== undefined ? userData.birthdayVoucherActive : true;

            if (userData.balance === undefined) {
              await setDoc(userDocRef, { balance, vipPoints, stamps, birthdayVoucherActive }, { merge: true });
            }

            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilizator'),
              phone: userData.phone || '',
              balance,
              vipPoints,
              stamps,
              birthdayVoucherActive
            });
          } else {
            const balance = 150.0;
            const vipPoints = 120;
            const stamps = 4;
            const birthdayVoucherActive = true;

            await setDoc(userDocRef, {
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilizator'),
              email: firebaseUser.email || '',
              phone: '',
              balance,
              vipPoints,
              stamps,
              birthdayVoucherActive,
              createdAt: new Date().toISOString()
            });

            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilizator'),
              phone: '',
              balance,
              vipPoints,
              stamps,
              birthdayVoucherActive
            });
          }
        } catch (error) {
          console.error("Error loading user profile from Firestore:", error);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilizator'),
            phone: '',
            balance: 150.0,
            vipPoints: 120,
            stamps: 4,
            birthdayVoucherActive: true
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product, qty = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    let userData = {};
    if (userDoc.exists()) {
      userData = userDoc.data();
    }
    
    const balance = userData.balance !== undefined ? userData.balance : 150.0;
    const vipPoints = userData.vipPoints !== undefined ? userData.vipPoints : 120;
    const stamps = userData.stamps !== undefined ? userData.stamps : 4;
    const birthdayVoucherActive = userData.birthdayVoucherActive !== undefined ? userData.birthdayVoucherActive : true;

    if (userDoc.exists() && userData.balance === undefined) {
      await setDoc(userDocRef, { balance, vipPoints, stamps, birthdayVoucherActive }, { merge: true });
    }

    const user = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: userData.name || firebaseUser.email.split('@')[0],
      phone: userData.phone || '',
      balance,
      vipPoints,
      stamps,
      birthdayVoucherActive
    };
    setCurrentUser(user);
    setShowAuthModal(false);
    return true;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    return true;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    setShowAuthModal(false);
    return true;
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
    setShowAuthModal(false);
    return true;
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    await signInWithPopup(auth, provider);
    setShowAuthModal(false);
    return true;
  };

  const register = async (name, email, phone, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const balance = 150.0;
    const vipPoints = 120;
    const stamps = 4;
    const birthdayVoucherActive = true;

    const userData = {
      name,
      email,
      phone,
      balance,
      vipPoints,
      stamps,
      birthdayVoucherActive,
      createdAt: new Date().toISOString()
    };
    await setDoc(userDocRef, userData);
    
    const user = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      phone,
      balance,
      vipPoints,
      stamps,
      birthdayVoucherActive
    };
    setCurrentUser(user);
    setShowAuthModal(false);
    return true;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setShowProfileModal(false);
  };

  const updateProfile = async (name, phone) => {
    if (!currentUser) return false;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, { name, phone }, { merge: true });
    setCurrentUser(prev => ({ ...prev, name, phone }));
    return true;
  };

  const topUpWallet = async (amount) => {
    if (!currentUser) return false;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const newBalance = (currentUser.balance || 0) + amount;
    await setDoc(userDocRef, { balance: newBalance }, { merge: true });
    setCurrentUser(prev => ({ ...prev, balance: newBalance }));
    return true;
  };

  const useBirthdayVoucher = async () => {
    if (!currentUser) return false;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, { birthdayVoucherActive: false }, { merge: true });
    setCurrentUser(prev => ({ ...prev, birthdayVoucherActive: false }));
    return true;
  };

  const deleteAccount = async () => {
    if (!currentUser) return false;
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);
      await user.delete();
    }
    setCurrentUser(null);
    setShowProfileModal(false);
    return true;
  };

  // Translation helper function
  const t = (key) => {
    return translations[language]?.[key] || translations['ro']?.[key] || key;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      selectedStore,
      setSelectedStore,
      locations,
      locationsLoading,
      isCartOpen,
      setIsCartOpen,
      theme,
      toggleTheme,
      language,
      setLanguage,
      t,
      currentUser,
      setCurrentUser,
      authLoading,
      showAuthModal,
      setShowAuthModal,
      showProfileModal,
      setShowProfileModal,
      login,
      resetPassword,
      loginWithGoogle,
      loginWithFacebook,
      loginWithApple,
      register,
      logout,
      updateProfile,
      topUpWallet,
      useBirthdayVoucher,
      deleteAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};
