import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import CandyBarPage from './pages/CandyBarPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import ReservationsPage from './pages/ReservationsPage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

function MainApp() {
  return (
    <div className="app-wrapper smooth-scroll">
      {/* Global Header */}
      <Header />

      {/* Pages Switch Router */}
      <main className="main-content-layout">
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
      </main>

      {/* Global Overlays */}
      <CartSidebar />
      <AuthModal />

      {/* Global Footer */}
      <Footer />
    </div>
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
