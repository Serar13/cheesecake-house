import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { currentUser, setShowAuthModal, t, language } = useApp();
  const isRo = language === 'ro';

  return (
    <footer className="main-footer-section">
      <div className="footer-container">
        
        {/* Main Grid */}
        <div className="footer-main-grid">
          
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img 
                src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" 
                alt="The Cheesecake House Logo" 
                className="footer-logo-img"
              />
              <div className="footer-brand-text">
                <h4>THE CHEESECAKE HOUSE</h4>
                <span className="footer-brand-motto">Find joy in the simple</span>
              </div>
            </div>
            <p className="footer-description">{t('footerBrandDesc')}</p>

            
            {/* Social icons - Using official SVG assets */}
            <div className="social-links-container">
              <a href="https://www.facebook.com/thecheesecakehousetgm" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                <img 
                  src="https://assets.boosteat.com/shop-images/be-icons/social/social-icon-facebook-black.svg" 
                  alt="Facebook" 
                  className="social-icon-img" 
                />
              </a>
              <a href="https://www.instagram.com/cheesecakehouse.ro/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                <img 
                  src="https://assets.boosteat.com/shop-images/be-icons/social/social-icon-instagram-black.svg" 
                  alt="Instagram" 
                  className="social-icon-img" 
                />
              </a>
              <a href="https://www.tiktok.com/@thecheesecakehous5" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="TikTok">
                <img 
                  src="https://assets.boosteat.com/shop-images/be-icons/social/tiktok-black.svg" 
                  alt="TikTok" 
                  className="social-icon-img" 
                />
              </a>
            </div>

            {/* ANPC Badges Section (Relocated) */}
            <div className="footer-brand-anpc">
              <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="anpc-badge-link">
                <img 
                  src="https://assets.boosteat.com/shop-images/legal/anpc-sal.webp" 
                  alt="ANPC SAL" 
                  className="anpc-badge-img" 
                />
              </a>
              <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO" target="_blank" rel="noopener noreferrer" className="anpc-badge-link">
                <img 
                  src="https://assets.boosteat.com/shop-images/legal/anpc-sol.webp" 
                  alt="ANPC SOL" 
                  className="anpc-badge-img" 
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4>{t('footerQuickLinks')}</h4>
            <ul className="footer-links-list">
              <li><Link to="/">{t('navMenu') === 'Menu' ? 'Home' : t('navMenu') === 'Menü' ? 'Főoldal' : 'Acasă'}</Link></li>
              <li><Link to="/meniu">{t('navMenu')}</Link></li>
              <li><Link to="/despre-noi">{t('navAbout')}</Link></li>
              <li><Link to="/candy-bar">{t('navCandyBar')}</Link></li>
              <li><Link to="/rezervari">{isRo ? 'Rezervări' : 'Reservations'}</Link></li>
              <li><Link to="/contact">{t('navContact')}</Link></li>
              {currentUser ? (
                <li><Link to="/profil" className="footer-profile-link">{isRo ? 'Profilul Meu 👤' : 'My Profile 👤'}</Link></li>
              ) : (
                <li><button onClick={() => setShowAuthModal(true)} className="footer-login-link-btn">{isRo ? 'Conectare 🔑' : 'Login 🔑'}</button></li>
              )}
            </ul>
          </div>

          {/* Schedule Summary */}
          <div className="footer-info-col">
            <h4>{t('footerInfoTitle')}</h4>
            <div className="footer-schedule-grid">
              <div className="schedule-item">
                <span className="schedule-city">📍 Tg. Mureș</span>
                <span className="schedule-hours">Luni - Duminică: 10:00 - 19:30</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-city">📍 Cluj-Napoca</span>
                <span className="schedule-hours">Luni - Duminică: 10:00 - 21:00</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-city">📍 Bistrița</span>
                <span className="schedule-hours">Luni - Duminică: 10:00 - 20:00</span>
              </div>
            </div>
          </div>

          {/* Mobile App Promotion Column */}
          <div className="footer-app-col">
            <h4>{t('footerAppTitle')}</h4>
            <p className="footer-app-desc">{t('footerAppDesc')}</p>
            <div className="footer-app-buttons">
              <a 
                href="https://apps.apple.com/ro/app/the-cheesecake-house" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="app-badge-btn"
                aria-label="Download on the App Store"
              >
                <svg viewBox="0 0 170 170" width="20" height="20" fill="currentColor" className="app-badge-icon">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.12-3.57-2.8-7.5-7.7-11.78-14.7-6.27-10.27-11.21-22.18-14.84-35.72-3.63-13.54-5.45-26.33-5.45-38.39 0-16.14 3.86-29.39 11.58-39.73 7.71-10.35 17.51-15.6 29.4-15.77 5.07 0 10.37 1.34 15.9 4.03 5.53 2.7 9.39 4.03 11.57 4.03 2.05 0 5.86-1.37 11.45-4.11 5.59-2.74 10.74-4.07 15.47-4.01 13.55.25 24.16 5.17 31.83 14.75-12.63 7.64-18.86 17.75-18.7 30.33.16 10.19 3.93 18.7 11.3 25.53 7.37 6.83 16.03 10.4 25.99 10.71-2.21 6.53-4.88 13.06-8.01 19.59zM119.22 28.56c0-7.85 2.8-15.11 8.41-21.78 6.53-7.85 14.28-11.97 22.84-11.97.16.89.24 1.73.24 2.53 0 7.55-2.81 14.71-8.43 21.49-6.4 7.64-14.12 11.69-23.15 11.69-.32-1.04-.49-2.03-.49-2.96z" />
                </svg>
                <div className="app-badge-text">
                  <span className="app-badge-subtitle">Download on the</span>
                  <span className="app-badge-title">App Store</span>
                </div>
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=ro.cheesecakehouse.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="app-badge-btn"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor" className="app-badge-icon">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58-33.3-60.7 60.7 60.7 60.7 58-33.3c17.2-9.9 17.2-25.9 0-34.8zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
                </svg>
                <div className="app-badge-text">
                  <span className="app-badge-subtitle">GET IT ON</span>
                  <span className="app-badge-title">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Seals Bottom Section */}
        <div className="footer-seals-bottom-section">
          <div className="footer-seals-row-centered">
            <img 
              src="https://assets.boosteat.com/images/c165/2024-07-08/20240708103119212668bbff7af981/image.png" 
              alt="Furnizor al Casei Regale a României" 
              className="footer-seal-img-bottom"
            />
            <img 
              src="https://assets.boosteat.com/images/c165/2024-07-08/20240708103123212668bbffb2ba85/image.png" 
              alt="Best Takeaway Food 2023 - Restaurant Guru" 
              className="footer-seal-img-bottom"
            />
          </div>
          <p className="footer-copyright-centered">
            © Copyright 2026 THE CHEESECAKE HOUSE S.R.L.
          </p>
          <div className="footer-legal-links-inline">
            <a href="#privacy">{isRo ? 'Confidențialitate' : 'Privacy'}</a>
            <span className="inline-sep">•</span>
            <a href="#terms">{isRo ? 'Termeni și Condiții' : 'Terms & Conditions'}</a>
            <span className="inline-sep">•</span>
            <a href="#cookies">Cookies</a>
          </div>
          <p className="footer-powered-by">
            Powered by Boost Eat
          </p>
        </div>

      </div>
    </footer>
  );
}
