import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css';

export default function Header() {
  const {
    cartCount,
    setIsCartOpen,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    currentUser,
    setShowAuthModal
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'ro', label: 'RO', flag: '🇷🇴' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'hu', label: 'HU', flag: '🇭🇺' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleLangSelect = (code) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Left Side: Language Selector */}
        <div className="header-left">
          {/* Language Selector Dropdown */}
          <div className="lang-selector-wrapper">
            <button 
              className="lang-selector-btn" 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={langDropdownOpen}
              title="Schimbă limba / Change language"
            >
              <span className="lang-flag">{currentLang.flag}</span>
              <span className="lang-code-text">{currentLang.label}</span>
              <span className="arrow-icon">{langDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {langDropdownOpen && (
              <ul className="lang-dropdown-menu">
                {languages.map(lang => (
                  <li key={lang.code}>
                    <button 
                      className={`lang-dropdown-item ${lang.code === language ? 'active' : ''}`}
                      onClick={() => handleLangSelect(lang.code)}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span>{lang.label === 'RO' ? 'Română' : lang.label === 'EN' ? 'English' : 'Magyar'}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Center: Brand Logo & Name */}
        <div className="brand-logo-area">
          <Link to="/" className="logo-link">
            <img 
              src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" 
              alt="The Cheesecake House Logo" 
              className="logo-img"
            />
            <span className="brand-title">THE CHEESECAKE HOUSE</span>
          </Link>
        </div>

        {/* Right Side: Theme Selector & Cart */}
        <div className="header-right">

          {/* Theme Switcher Button */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Comută pe Mod Întunecat' : 'Comută pe Mod Luminos'}
            title={theme === 'light' ? 'Mod Întunecat' : 'Mod Luminos'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Profile / Auth trigger */}
          {currentUser ? (
            <Link 
              to="/profil" 
              className="user-profile-btn"
              title={currentUser.name || "Profilul Meu"}
            >
              <span className="profile-btn-icon">👤</span>
              <span className="profile-btn-text">{currentUser.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <button 
              className="login-trigger-btn"
              onClick={() => setShowAuthModal(true)}
              title="Conectează-te în cont"
            >
              <span className="profile-btn-icon">🔑</span>
              <span className="profile-btn-text">Conectare</span>
            </button>
          )}

          {/* Cart Icon trigger */}
          <button 
            className="cart-trigger-btn" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Deschide coșul de cumpărături"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-label">{t('cartLabel')}</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
