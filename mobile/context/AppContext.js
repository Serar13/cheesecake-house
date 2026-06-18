import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getActiveProducts,
  getActivePromotions,
  getActiveLocations,
  getUserReservations,
  createOrder,
  createReservation
} from '../services/firestore';

// Map a Firestore promotion doc to the shape the Offers UI expects.
const mapPromotionToOffer = (p) => {
  const category = p.category || (p.exclusive ? 'secret' : 'flash');
  return {
    id: p.id,
    title: p.title || '',
    desc: p.description || '',
    code: p.code || '',
    expiry: p.expiry || '',
    isNew: p.isNew !== undefined ? p.isNew : true,
    category
  };
};

// Map a Firestore product doc to the shape the menu/cart UI expects.
const mapProduct = (p) => ({
  id: p.id,
  name: p.name || '',
  desc: p.description || '',
  description: p.description || '',
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  category: p.categoryId || p.category || 'cheesecake',
  categoryId: p.categoryId || '',
  unit: p.unit || '',
  weight: p.weight || '',
  // imageUrl may be a server-relative path ("/images/..") that won't resolve
  // on a device; expose it as-is and let the UI guard against it.
  imageUrl: p.imageUrl || '',
  availability: p.availability || 'available'
});

// Map a Firestore reservation doc to the shape the Reservations UI expects.
const mapReservation = (r) => ({
  id: r.id,
  location: r.locationName || r.location || '',
  locationId: r.locationId || '',
  tableId: r.tableId || '',
  table: r.tableLabel || r.table || '',
  date: r.dateLabel || (r.date && r.time ? `${r.date}, la ora ${r.time}` : (r.date || '')),
  rawDate: r.date || '',
  time: r.time || '',
  guests: r.guests || 0,
  status: r.status === 'confirmed' ? 'Confirmată'
    : r.status === 'cancelled' ? 'Anulată'
    : r.status === 'pending' ? 'În așteptare'
    : (r.status || 'În așteptare'),
  preOrder: Array.isArray(r.items) ? r.items : (r.preOrder || [])
});

const AppContext = createContext();

export const THEME_COLORS = {
  light: {
    bg: '#fefdfb',
    cardBg: '#ffffff',
    text: '#2d241c',
    textMuted: '#7c7063',
    border: '#f1eae0',
    gold: '#c4a178',
    goldMuted: 'rgba(196, 161, 120, 0.1)',
    inputBg: '#f6f2ee',
    statusBar: 'dark-content'
  },
  dark: {
    bg: '#12100e',
    cardBg: '#1b1713',
    text: '#f6f2ee',
    textMuted: '#aaa093',
    border: '#2d241c',
    gold: '#c4a178',
    goldMuted: 'rgba(196, 161, 120, 0.15)',
    inputBg: '#2d241c',
    statusBar: 'light-content'
  }
};

const TRANSLATIONS = {
  ro: {
    menu: "Meniu",
    aboutUsTitle: "Despre Noi",
    aboutUsText: "Din căutarea simplităţii şi a micilor plăceri a luat naştere în 2017 conceptul The Cheesecake House. De la prima reţetă perfecţionată în bucătăria de acasă, am dezvoltat peste 60 de sortimente unice, coapte cu drag în laboratorul nostru.\n\nSuntem mândri să fim singurii Furnizori Oficiali pe partea de cofetărie ai Casei Regale a României, titlu acordat de MS Majestatea Sa Margareta, Custodele Coroanei.\n\nMisiunea noastră este să propunem diversitate în simplitate prin texturi, gusturi şi arome deosebite. Motto-ul nostru este: 'Find joy in the simple!'",
    loyalty: "Fidelitate",
    reservations: "Rezervări",
    profile: "Profil",
    offers: "Oferte",
    menuCatalog: "Catalog Meniu",
    loyaltyClub: "Club Fidelitate",
    bookTable: "Rezervă o Masă",
    myWallet: "Portofelul Meu",
    exclusiveOffers: "Oferte Exclusive",
    profileTitle: "Profilul Meu",
    fullName: "Nume Complet",
    email: "Adresă Email",
    phone: "Număr Telefon",
    editProfile: "Editează Profilul",
    deleteAccount: "Șterge Contul",
    logout: "Deconectare Cont",
    saveChanges: "Salvează Modificările",
    cancel: "Anulează",
    delete: "Șterge",
    confirmDelete: "Ștergere Cont",
    confirmDeleteDesc: "Ești sigur că vrei să-ți ștergi contul definitiv? Toate datele tale, soldul din portofel și rezervările active vor fi pierdute.",
    accountDeleted: "Cont Șters",
    accountDeletedDesc: "Contul tău a fost șters cu succes.",
    walletTitle: "Portofel Digital",
    digitalWalletCard: "Card Portofel Digital",
    walletBalance: "Soldul tău digital",
    topUpWallet: "Alimentează Portofelul",
    vouchersAndActiveGifts: "Vouchere și Cadouri Active",
    sendGiftCard: "Trimite un Card Cadou digital",
    recipientName: "Nume Destinatar:",
    giftAmount: "Suma Cadou (RON):",
    giftMessage: "Mesaj Personalizat (Opțional):",
    sendGiftButton: "Cumpără și Trimite Cadoul",
    insufficientFunds: "Sold Insuficient",
    giftSent: "Card Cadou Trimis!",
    topUpSuccess: "Alimentare Reușită",
    error: "Eroare",
    pleaseFillFields: "Vă rugăm să completați toate câmpurile.",
    welcomeFamily: "Bine ai venit în familia The Cheesecake House!",
    stampNotice: "Cumpără 9 felii și a 10-a este GRATUITĂ!",
    themeMode: "Mod Întunecat",
    darkMode: "Mod Întunecat",
    stampsLeftText: "felii până la următorul cheesecake cadou!",
    chooseLocation: "Alege Locația:",
    chooseDay: "Alege Ziua:",
    timeSlot: "Interval Orar:",
    guestsNum: "Număr Persoane:",
    availableTables: "Mese Disponibile la",
    bookTableButton: "Confirmă Rezervarea Mesei",
    activeReservations: "Rezervările Tale Active",
    noActiveReservations: "Nu ai nicio rezervare activă momentan.",
    confirmReservationTitle: "Rezervare Confirmată!",
    tableAvailable: "Liberă",
    tableSelected: "Selectată",
    tableBooked: "Ocupată",
    selectAvailableTableError: "Te rugăm să selectezi o masă disponibilă!",
    preOrderTitle: "Adaugă o Pre-Comandă (Opțional):",
    preOrderDesc: "Rezervă sortimentele preferate pentru a fi pregătite la masă.",
    preOrderAdd: "Adaugă în pre-comandă",
    preOrderAdded: "Adăugat",
    needAccountTitle: "Ai nevoie de cont",
    needAccountDesc: "Creează un cont sau conectează-te pentru a continua.",
    connectOrRegister: "Conectare / Cont nou",
    birthdayVoucherTitle: "Felie Cadou de Ziua Ta! 🎂",
    birthdayVoucherDesc: "O felie din orice cheesecake din meniu, gratuită.",
    voucherScannedTitle: "Voucher scanat",
    voucherScannedDesc: "Voucherul tău pentru o felie gratuită de cheesecake a fost activat și trimis către scaner! Arată acest ecran ospătarului.",
    giftDescription: "Surprinde-ți prietenii cu un card valoric direct pe contul lor de client!",
    appSettings: "Setări Aplicație",
    emptyVouchers: "Nu ai alte vouchere active momentan.",
    connectingOrRegistering: "Autentifică-te pentru a plasa comanda",
    cconnect: "Conectare",
    cnew: "Cont nou",
    loadingCakes: "Se încarcă sortimentele delicioase...",
    vipPointsLabel: "Puncte VIP",
    secretBadge: "Secret",
    addedToCart: "Adăugat în coș!",
    cartTitle: "Coșul Tău",
    cartEmpty: "Coșul tău este gol.",
    checkoutButton: "Trimite Comanda",
    pickupLoc: "Locație Ridicare:",
    pickupTimeLabel: "Timp Pregătire:",
    continueAsGuest: "Înapoi la meniu",
    locationLayoutTitle: "Schița Locației",
    view3D: "Vizualizare 3D",
    viewTopDown: "Vedere de sus",
    guestTitle: "Vizitator",
    guestSubtitle: "Conectează-te pentru a-ți activa portofelul digital, cardul de loialitate și a rezerva mese.",
    lockedFeatureTitle: "Secțiune Blocată",
    lockedFeatureDesc: "Această secțiune este destinată clienților cu cont. Conectează-te sau creează un cont în câteva secunde!"
  },
  en: {
    menu: "Menu",
    aboutUsTitle: "About Us",
    aboutUsText: "Born in 2017 from the search of simplicity and life's little pleasures, The Cheesecake House started with a single recipe perfected at home. Today, we have created over 60 unique cheesecake flavors, baked with love in our own laboratory.\n\nWe are proud to be the Official Confectionery Supplier of the Royal House of Romania, a title awarded by Her Majesty Margareta, Custodian of the Romanian Crown.\n\nOur mission is to offer diversity in simplicity through refined textures and flavors. Our motto is: 'Find joy in the simple!'",
    loyalty: "Loyalty",
    reservations: "Bookings",
    profile: "Profile",
    offers: "Offers",
    menuCatalog: "Menu Catalog",
    loyaltyClub: "Loyalty Club",
    bookTable: "Book a Table",
    myWallet: "My Wallet",
    exclusiveOffers: "Exclusive Offers",
    profileTitle: "My Profile",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    editProfile: "Edit Profile",
    deleteAccount: "Delete Account",
    logout: "Log Out",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    confirmDelete: "Delete Account",
    confirmDeleteDesc: "Are you sure you want to permanently delete your account? All your data, wallet balance, and active reservations will be lost.",
    accountDeleted: "Account Deleted",
    accountDeletedDesc: "Your account has been successfully deleted.",
    walletTitle: "Digital Wallet",
    digitalWalletCard: "Digital Wallet Card",
    walletBalance: "Your digital balance",
    topUpWallet: "Top Up Wallet",
    vouchersAndActiveGifts: "Active Vouchers & Gifts",
    sendGiftCard: "Send a digital Gift Card",
    recipientName: "Recipient Name:",
    giftAmount: "Gift Amount (RON):",
    giftMessage: "Personalized Message (Optional):",
    sendGiftButton: "Buy and Send Gift",
    insufficientFunds: "Insufficient Balance",
    giftSent: "Gift Card Sent!",
    topUpSuccess: "Top Up Successful",
    error: "Error",
    pleaseFillFields: "Please fill in all fields.",
    welcomeFamily: "Welcome to The Cheesecake House family!",
    stampNotice: "Buy 9 slices and the 10th is FREE!",
    themeMode: "Dark Mode",
    darkMode: "Dark Mode",
    stampsLeftText: "slices left until next free cheesecake!",
    chooseLocation: "Choose Location:",
    chooseDay: "Choose Day:",
    timeSlot: "Time Slot:",
    guestsNum: "Number of Guests:",
    availableTables: "Available Tables in",
    bookTableButton: "Confirm Table Reservation",
    activeReservations: "Your Active Reservations",
    noActiveReservations: "You have no active reservations at the moment.",
    confirmReservationTitle: "Reservation Confirmed!",
    tableAvailable: "Available",
    tableSelected: "Selected",
    tableBooked: "Occupied",
    selectAvailableTableError: "Please select an available table!",
    preOrderTitle: "Add a Pre-Order (Optional):",
    preOrderDesc: "Reserve your favorite items to be ready at the table.",
    preOrderAdd: "Add to pre-order",
    preOrderAdded: "Added",
    needAccountTitle: "Account Required",
    needAccountDesc: "Create an account or log in to continue.",
    connectOrRegister: "Login / New Account",
    birthdayVoucherTitle: "Birthday Gift Slice! 🎂",
    birthdayVoucherDesc: "A free slice of any cheesecake from the menu.",
    voucherScannedTitle: "Voucher Scanned",
    voucherScannedDesc: "Your voucher for a free slice of cheesecake has been activated! Show this screen to the waiter.",
    giftDescription: "Surprise your friends with a gift card value directly to their account!",
    appSettings: "App Settings",
    emptyVouchers: "You have no other active vouchers at the moment.",
    connectingOrRegistering: "Log in to place your order",
    cconnect: "Log In",
    cnew: "New Account",
    loadingCakes: "Loading delicious assortments...",
    vipPointsLabel: "VIP Points",
    secretBadge: "Secret",
    addedToCart: "Added to cart!",
    cartTitle: "Your Cart",
    cartEmpty: "Your cart is empty.",
    checkoutButton: "Submit Order",
    pickupLoc: "Pickup Location:",
    pickupTimeLabel: "Preparation Time:",
    continueAsGuest: "Back to Menu",
    locationLayoutTitle: "Location Layout",
    view3D: "3D View",
    viewTopDown: "Top-Down View",
    guestTitle: "Guest",
    guestSubtitle: "Log in to activate your digital wallet, loyalty card, and book tables.",
    lockedFeatureTitle: "Locked Section",
    lockedFeatureDesc: "This section is reserved for registered clients. Log in or create an account in seconds!"
  },
  hu: {
    menu: "Menü",
    aboutUsTitle: "Rólunk",
    aboutUsText: "A The Cheesecake House koncepciója 2017-ben született meg, az egyszerűség és az élet apró örömeinek kereséséből. Az első, otthon tökéletesített recepttől kezdve mára több mint 60 egyedi sajttorta-változatot fejlesztettünk ki, amelyeket szeretettel sütünk saját laboratóriumunkban.\n\nBüszkék vagyunk arra, hogy a Román Királyi Ház hivatalos cukrászati beszállítói vagyunk, ezt a címet Margit Őfelsége, a román korona őre adományozta nekünk.\n\nKüldetésünk, hogy a kifinomult textúrák és ízek révén változatosságot kínáljunk az egyszerűségben. Mottónk: 'Találd meg az örömöt az egyszerűben!'",
    loyalty: "Hűség",
    reservations: "Foglalások",
    profile: "Profil",
    offers: "Ajánlatok",
    menuCatalog: "Menü Katalógus",
    loyaltyClub: "Hűség Klub",
    bookTable: "Asztalfoglalás",
    myWallet: "Pénztárcám",
    exclusiveOffers: "Exkluzív Ajánlatok",
    profileTitle: "Profilom",
    fullName: "Teljes Név",
    email: "E-mail Cím",
    phone: "Telefonszám",
    editProfile: "Profil szerkesztése",
    deleteAccount: "Fiók Törlése",
    logout: "Kijelentkezés",
    saveChanges: "Módosítások Mentése",
    cancel: "Mégse",
    delete: "Törlés",
    confirmDelete: "Fiók törlése",
    confirmDeleteDesc: "Biztosan véglegesen törölni szeretné a fiókját? Minden adata, a pénztárca egyenlege és az aktív foglalásai elvesznek.",
    accountDeleted: "Fiók Törölve",
    accountDeletedDesc: "A fiókját sikeresen töröltük.",
    walletTitle: "Digitális Pénztárca",
    digitalWalletCard: "Digitális Pénztárca Kártya",
    walletBalance: "Digitális egyenleged",
    topUpWallet: "Pénztárca Feltöltése",
    vouchersAndActiveGifts: "Aktív Utalványok & Ajándékok",
    sendGiftCard: "Digitális Ajándékkártya Küldése",
    recipientName: "Címzett Neve:",
    giftAmount: "Ajándék Összege (RON):",
    giftMessage: "Személyre szabott Üzenet (Opcionális):",
    sendGiftButton: "Vásárlás és Ajándék Küldése",
    insufficientFunds: "Elégtelen Egyenleg",
    giftSent: "Ajándékkártya Elküldve!",
    topUpSuccess: "Sikeres Feltöltés",
    error: "Hiba",
    pleaseFillFields: "Kérjük, töltse ki az összes mezőt.",
    welcomeFamily: "Üdvözöljük a The Cheesecake House családban!",
    stampNotice: "Vásároljon 9 szeletet, a 10. INGYENES!",
    themeMode: "Sötét Mód",
    darkMode: "Sötét Mód",
    stampsLeftText: "szelet maradt a következő ingyen cheesecake-ig!",
    chooseLocation: "Válassz Helyszínt:",
    chooseDay: "Válassz Napot:",
    timeSlot: "Idősáv:",
    guestsNum: "Személyek Száma:",
    availableTables: "Szabad Asztalok itt:",
    bookTableButton: "Asztalfoglalás Megerősítése",
    activeReservations: "Aktív Foglalásaid",
    noActiveReservations: "Jelenleg nincs aktív foglalásod.",
    confirmReservationTitle: "Foglalás Megerősítve!",
    tableAvailable: "Szabad",
    tableSelected: "Kiválasztott",
    tableBooked: "Foglalt",
    selectAvailableTableError: "Kérjük, válasszon egy szabad asztalt!",
    preOrderTitle: "Előrendelés Hozzáadása (Opcionális):",
    preOrderDesc: "Foglalja le kedvenc szeleteit, hogy az asztalhoz érkezve készen álljanak.",
    preOrderAdd: "Hozzáadás az előrendeléshez",
    preOrderAdded: "Hozzáadva",
    needAccountTitle: "Fiók Szükséges",
    needAccountDesc: "Hozzon létre egy fiókot vagy jelentkezzen be a folytatáshoz.",
    connectOrRegister: "Bejelentkezés / Új Fiók",
    birthdayVoucherTitle: "Születésnapi Ajándék Szelet! 🎂",
    birthdayVoucherDesc: "Egy ingyenes szelet bármelyik sajttortából a menüről.",
    voucherScannedTitle: "Utalvány Beolvasva",
    voucherScannedDesc: "Az ingyenes sajttorta utalványát aktiváltuk! Mutassa meg ezt a képernyőt a pincérnek.",
    giftDescription: "Lepje meg barátait egy ajándékkártyával közvetlenül a fiókjukba!",
    appSettings: "Alkalmazás Beállítások",
    emptyVouchers: "Jelenleg nincs más aktív utalványod.",
    connectingOrRegistering: "Jelentkezzen be a rendelés leadásához",
    cconnect: "Bejelentkezés",
    cnew: "Új Fiók",
    loadingCakes: "Ízletes választék betöltése...",
    vipPointsLabel: "VIP Pontok",
    secretBadge: "Titkos",
    addedToCart: "Kosárhoz adva!",
    cartTitle: "Kosarad",
    cartEmpty: "A kosarad üres.",
    checkoutButton: "Rendelés Leadása",
    pickupLoc: "Átvétel Helyszíne:",
    pickupTimeLabel: "Elkészítési Idő:",
    continueAsGuest: "Vissza a menühöz",
    locationLayoutTitle: "Helyszín Alaprajza",
    view3D: "3D Nézet",
    viewTopDown: "Felülnézet",
    guestTitle: "Vendég",
    guestSubtitle: "Jelentkezzen be a digitális pénztárca, a hűségkártya aktiválásához és az asztalfoglaláshoz.",
    lockedFeatureTitle: "Zárolt szakasz",
    lockedFeatureDesc: "Ez a szakasz regisztrált ügyfelek számára van fenntartva. Jelentkezzen be vagy hozzon létre egy fiókot másodpercek alatt!"
  }
};

export const AppProvider = ({ children }) => {
  // 1. Language State
  const [language, setLanguage] = useState('ro');

  // 2. Theme State
  const [theme, setTheme] = useState('light'); 

  // 3. Auth & Loading State
  const [splashDone, setSplashDone] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  const getFriendlyError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Această adresă de email este deja utilizată.';
      case 'auth/invalid-email':
        return 'Adresa de email introdusă nu este validă.';
      case 'auth/weak-password':
        return 'Parola trebuie să aibă cel puțin 6 caractere.';
      case 'auth/user-disabled':
        return 'Acest cont a fost dezactivat.';
      case 'auth/user-not-found':
        return 'Nu am găsit niciun cont cu această adresă de email.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email sau parolă incorectă.';
      case 'auth/too-many-requests':
        return 'Contul a fost blocat temporar din cauza prea multor încercări eșuate.';
      default:
        return 'A apărut o eroare. Te rugăm să încerci din nou.';
    }
  };

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Unsubscribe from previous user document listener if any
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to Firestore document changes in real-time
        unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
          let nameVal = firebaseUser.displayName;
          if (!nameVal && firebaseUser.email) {
            const email = firebaseUser.email;
            if (email.startsWith('google.')) {
              nameVal = 'Google User';
            } else if (email.startsWith('facebook.')) {
              nameVal = 'Facebook User';
            } else if (email.startsWith('apple.')) {
              nameVal = 'Apple User';
            } else {
              nameVal = email.split('@')[0];
            }
          }
          if (!nameVal) nameVal = 'Utilizator';

          let phoneVal = '';
          let balanceVal = 150.0;
          let vipPointsVal = 120;
          let stampsVal = 4;
          let birthdayVoucherActiveVal = true;

          if (docSnap.exists()) {
            const userData = docSnap.data();
            nameVal = userData.name || nameVal;
            phoneVal = userData.phone || phoneVal;
            balanceVal = userData.balance !== undefined ? userData.balance : balanceVal;
            vipPointsVal = userData.vipPoints !== undefined ? userData.vipPoints : vipPointsVal;
            stampsVal = userData.stamps !== undefined ? userData.stamps : stampsVal;
            birthdayVoucherActiveVal = userData.birthdayVoucherActive !== undefined ? userData.birthdayVoucherActive : birthdayVoucherActiveVal;
          } else {
            // User registered or logged in, but Firestore doc doesn't exist yet
            try {
              await setDoc(userDocRef, {
                name: nameVal,
                email: firebaseUser.email || '',
                phone: phoneVal,
                balance: balanceVal,
                vipPoints: vipPointsVal,
                stamps: stampsVal,
                birthdayVoucherActive: birthdayVoucherActiveVal,
                createdAt: new Date().toISOString()
              });
            } catch (err) {
              console.error("Error creating default user doc:", err);
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: nameVal,
            phone: phoneVal
          });
          setIsLoggedIn(true);
          setIsGuest(false);
          setBalance(balanceVal);
          setVipPoints(vipPointsVal);
          setStamps(stampsVal);
          setBirthdayVoucherActive(birthdayVoucherActiveVal);
        }, (error) => {
          console.error("Firestore snapshot error:", error);
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsGuest(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  // 4. Loyalty Program State
  const [stamps, setStamps] = useState(4);
  const [vipPoints, setVipPoints] = useState(120);
  const maxStamps = 9;

  // 5. Wallet & Balance State
  const [balance, setBalance] = useState(150.0);
  const [birthdayVoucherActive, setBirthdayVoucherActive] = useState(true);

  // 6. Cart State
  const [cart, setCart] = useState([]);

  // 7. Reservations State (loaded from Firestore for the signed-in user)
  const [reservations, setReservations] = useState([]);

  // 8. Notifications / Flash Offers State (loaded from Firestore promotions)
  const [offers, setOffers] = useState([]);

  // 9. Catalog State (products / locations loaded from Firestore)
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);

  // Load global catalog data (products, promotions, locations) from Firestore.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, promos, locs] = await Promise.all([
          getActiveProducts(),
          getActivePromotions(),
          getActiveLocations()
        ]);
        if (!active) return;
        setProducts(prods.map(mapProduct));
        setOffers(promos.map(mapPromotionToOffer));
        setLocations(locs);
      } catch (err) {
        console.error('Error loading catalog data:', err);
      } finally {
        if (active) {
          setProductsLoading(false);
          setOffersLoading(false);
          setLocationsLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  // Load the signed-in user's reservations from Firestore.
  useEffect(() => {
    let active = true;
    if (!user?.uid) {
      setReservations([]);
      return () => { active = false; };
    }
    (async () => {
      try {
        const rows = await getUserReservations(user.uid);
        if (!active) return;
        setReservations(rows.map(mapReservation));
      } catch (err) {
        console.error('Error loading reservations:', err);
        if (active) setReservations([]);
      }
    })();
    return () => { active = false; };
  }, [user?.uid]);

  // Translations helper
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['ro']?.[key] || key;
  };

  // Actions
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = async (email, password) => {
    if (!email || !password) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return false;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const resetPassword = async (email) => {
    if (!email) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return false;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Resetare Parolă', 'Un email de resetare a fost trimis pe adresa ta.');
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const getOrCreateSocialCredentials = async (providerName) => {
    try {
      const emailKey = `cheesecake_auth_${providerName}_email`;
      const passKey = `cheesecake_auth_${providerName}_pass`;
      
      let email = await AsyncStorage.getItem(emailKey);
      let password = await AsyncStorage.getItem(passKey);
      
      if (!email || !password) {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        email = `${providerName}.user.${randomId}@thecheesecakehouse.ro`;
        password = `PassSocial${randomId}!`;
        
        await AsyncStorage.setItem(emailKey, email);
        await AsyncStorage.setItem(passKey, password);
      }
      
      return { email, password };
    } catch (err) {
      console.error("AsyncStorage error generating credentials:", err);
      const randomId = Math.floor(100000 + Math.random() * 900000);
      return {
        email: `${providerName}.user.fallback.${randomId}@thecheesecakehouse.ro`,
        password: `PassSocialFallback${randomId}!`
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { email, password } = await getOrCreateSocialCredentials('google');
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { email, password } = await getOrCreateSocialCredentials('facebook');
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const loginWithApple = async () => {
    try {
      const { email, password } = await getOrCreateSocialCredentials('apple');
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const register = async (name, email, phone, password) => {
    if (!name || !email || !phone || !password) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return false;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const balanceVal = 150.0;
      const vipPointsVal = 120;
      const stampsVal = 4;
      const birthdayVoucherActiveVal = true;

      await setDoc(userDocRef, {
        name,
        email,
        phone,
        balance: balanceVal,
        vipPoints: vipPointsVal,
        stamps: stampsVal,
        birthdayVoucherActive: birthdayVoucherActiveVal,
        createdAt: new Date().toISOString()
      });
      
      Alert.alert(t('connectOrRegister'), t('welcomeFamily'));
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setIsLoggedIn(false);
  };

  const requestAuth = (reason) => {
    setIsGuest(false);
  };

  const updateProfile = async (name, email, phone) => {
    if (!name || !email || !phone) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return false;
    }
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, { name, phone }, { merge: true });
        setUser(prev => ({ ...prev, name, phone }));
        Alert.alert('Profil Actualizat', 'Datele tale au fost salvate cu succes.');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), getFriendlyError(err.code || err.message));
      return false;
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      t('confirmDelete'),
      t('confirmDeleteDesc'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive', 
          onPress: async () => {
            try {
              if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                await deleteDoc(userDocRef);
                await auth.currentUser.delete();
                Alert.alert(t('accountDeleted'), t('accountDeletedDesc'));
              }
            } catch (err) {
              console.error(err);
              Alert.alert(t('error'), getFriendlyError(err.code || err.message));
            }
          } 
        }
      ]
    );
  };

  const addStamp = async (count = 1) => {
    let newVal = stamps + count;
    let activeVoucher = birthdayVoucherActive;
    if (newVal >= maxStamps) {
      activeVoucher = true;
      newVal = newVal - maxStamps;
    }
    const newVip = vipPoints + (count * 15);
    
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, { 
          stamps: newVal, 
          vipPoints: newVip, 
          birthdayVoucherActive: activeVoucher 
        }, { merge: true });
      }
      setStamps(newVal);
      setBirthdayVoucherActive(activeVoucher);
      setVipPoints(newVip);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const addReservation = async (newRes) => {
    // Only persist when a user is signed in (reservations require userId).
    if (!auth.currentUser) {
      Alert.alert(t('needAccountTitle'), t('needAccountDesc'));
      return false;
    }

    const uid = auth.currentUser.uid;
    const items = Array.isArray(newRes.preOrder) ? newRes.preOrder : [];

    // Persisted doc follows the canonical reservations schema.
    const docData = {
      userId: uid,
      customerName: user?.name || '',
      locationId: newRes.locationId || '',
      locationName: newRes.location || '',
      tableId: newRes.tableId || '',
      tableLabel: newRes.table || '',
      date: newRes.rawDate || '',
      time: newRes.time || '',
      dateLabel: newRes.date || '',
      durationMinutes: newRes.durationMinutes || 90,
      guests: newRes.guests || 0,
      items,
      status: 'pending'
    };

    try {
      const newId = await createReservation(docData);
      // Reflect locally regardless of returned id (id may be null on offline).
      setReservations(prev => [
        {
          id: newId || `res-${Date.now()}`,
          location: newRes.location || '',
          locationId: newRes.locationId || '',
          tableId: newRes.tableId || '',
          table: newRes.table || '',
          date: newRes.date || '',
          rawDate: newRes.rawDate || '',
          time: newRes.time || '',
          guests: newRes.guests || 0,
          status: 'În așteptare',
          preOrder: items
        },
        ...prev
      ]);
      return true;
    } catch (err) {
      console.error('Error creating reservation:', err);
      Alert.alert(t('error'), t('error'));
      return false;
    }
  };

  const topUpWallet = async (amount) => {
    try {
      const newBalance = balance + amount;
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, { balance: newBalance }, { merge: true });
      }
      setBalance(newBalance);
    } catch (err) {
      console.error(err);
    }
  };

  const payWithWallet = async (amount, orderMeta = null) => {
    if (balance >= amount) {
      try {
        const newBalance = balance - amount;
        const stampsEarned = Math.floor(amount / 30);
        const count = stampsEarned > 0 ? stampsEarned : 1;

        let newStamps = stamps + count;
        let newVipPoints = vipPoints + (count * 15);
        let activeVoucher = birthdayVoucherActive;

        if (newStamps >= maxStamps) {
          activeVoucher = true;
          newStamps = newStamps - maxStamps;
        }

        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userDocRef, {
            balance: newBalance,
            stamps: newStamps,
            vipPoints: newVipPoints,
            birthdayVoucherActive: activeVoucher
          }, { merge: true });

          // Persist the order to Firestore (source: 'mobile', status 'pending').
          try {
            const orderItems = (orderMeta?.items || cart).map((item) => ({
              productId: item.id || '',
              name: item.name || '',
              price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
              quantity: item.quantity || 1
            }));
            await createOrder({
              userId: auth.currentUser.uid,
              customerName: user?.name || '',
              source: 'mobile',
              locationId: orderMeta?.locationId || '',
              locationName: orderMeta?.locationName || '',
              items: orderItems,
              total: amount,
              status: 'pending'
            });
          } catch (orderErr) {
            // An order-write failure must not roll back the wallet payment.
            console.error('Error creating order doc:', orderErr);
          }
        }

        setBalance(newBalance);
        setStamps(newStamps);
        setVipPoints(newVipPoints);
        setBirthdayVoucherActive(activeVoucher);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    return false;
  };

  const colors = THEME_COLORS[theme];

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      theme,
      colors,
      toggleTheme,
      splashDone,
      setSplashDone,
      user,
      isLoggedIn,
      isGuest,
      setIsGuest,
      loginAsGuest,
      requestAuth,
      login,
      resetPassword,
      loginWithGoogle,
      loginWithFacebook,
      loginWithApple,
      register,
      logout,
      updateProfile,
      deleteAccount,
      stamps,
      maxStamps,
      vipPoints,
      balance,
      birthdayVoucherActive,
      setBirthdayVoucherActive,
      cart,
      reservations,
      offers,
      products,
      locations,
      productsLoading,
      offersLoading,
      locationsLoading,
      addStamp,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addReservation,
      topUpWallet,
      payWithWallet,
      setOffers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
