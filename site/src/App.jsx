import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import { prefetchCatalog } from './services/prefetch';
// Home is the landing page — keep it in the initial bundle.
import Home from './pages/Home';
import './App.css';
import './components/Skeleton.css';

// Secondary pages are code-split and prefetched in the background once the
// app is interactive, so navigation stays instant without bloating first load.
const MenuPage = lazy(() => import('./pages/MenuPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CandyBarPage = lazy(() => import('./pages/CandyBarPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReservationsPage = lazy(() => import('./pages/ReservationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Lazy route chunks, prefetched on idle (after Home is interactive).
const ROUTE_IMPORTERS = [
  () => import('./pages/MenuPage'),
  () => import('./pages/ReservationsPage'),
  () => import('./pages/AboutPage'),
  () => import('./pages/CandyBarPage'),
  () => import('./pages/ReviewsPage'),
  () => import('./pages/ContactPage'),
  () => import('./pages/ProfilePage'),
];

function prefetchRoutes() {
  const idle =
    window.requestIdleCallback || ((cb) => setTimeout(() => cb(), 200));
  ROUTE_IMPORTERS.forEach((imp) => idle(() => imp().catch(() => {})));
}

function RouteFallback() {
  return (
    <div className="route-fallback" aria-hidden="true">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}

function MainApp() {
  const seen =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('cch_splash_seen') === '1';
  const [splashDone, setSplashDone] = useState(seen);

  // Start warming data + route chunks immediately — this runs underneath the
  // splash so the Home page is ready by the time the intro finishes.
  useEffect(() => {
    prefetchCatalog();
    prefetchRoutes();
  }, []);

  const finishSplash = () => {
    try {
      sessionStorage.setItem('cch_splash_seen', '1');
    } catch {
      /* sessionStorage may be unavailable (private mode) — ignore */
    }
    setSplashDone(true);
  };

  return (
    <>
      {!splashDone && <SplashScreen onDone={finishSplash} />}

      <div className="app-wrapper smooth-scroll">
        {/* Global Header */}
        <Header />

        {/* Pages Switch Router */}
        <main className="main-content-layout">
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/meniu" element={<MenuPage />} />
                <Route path="/despre-noi" element={<AboutPage />} />
                <Route path="/candy-bar" element={<CandyBarPage />} />
                <Route path="/recenzii" element={<ReviewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/rezervari" element={<ReservationsPage />} />
                <Route path="/profil" element={<ProfilePage />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>

        {/* Global Overlays */}
        <CartSidebar />
        <AuthModal />

        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}
