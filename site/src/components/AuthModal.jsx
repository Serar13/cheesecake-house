import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './AuthModal.css';

export default function AuthModal() {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    login, 
    register, 
    resetPassword, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithApple, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', or 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!showAuthModal) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const getFriendlyError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Această adresă de email este deja utilizată de un alt cont.';
      case 'auth/invalid-email':
        return 'Adresa de email introdusă nu este validă.';
      case 'auth/operation-not-allowed':
        return 'Metoda de conectare nu este activată în consolă.';
      case 'auth/weak-password':
        return 'Parola aleasă este prea slabă. Alege o parolă de cel puțin 6 caractere.';
      case 'auth/user-disabled':
        return 'Acest cont a fost dezactivat.';
      case 'auth/user-not-found':
        return 'Nu am găsit niciun cont înregistrat cu această adresă de email.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email sau parolă incorectă. Te rugăm să încerci din nou.';
      case 'auth/too-many-requests':
        return 'Prea multe încercări eșuate. Contul a fost blocat temporar. Încearcă mai târziu.';
      case 'auth/popup-closed-by-user':
        return 'Fereastra de conectare a fost închisă înainte de finalizare.';
      case 'permission-denied':
        return 'Eroare de permisiuni (insufficient permissions) în Firestore. Te rugăm să activezi regulile de citire/scriere pentru utilizatori în Consola Firebase.';
      default:
        return 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else if (activeTab === 'register') {
        await register(name, email, phone, password);
      } else if (activeTab === 'forgot') {
        await resetPassword(email);
        setSuccess('Un email de resetare a parolei a fost trimis pe adresa ta. Te rugăm să verifici folderul Inbox sau Spam.');
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(getFriendlyError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google login error:", err);
      setError(getFriendlyError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error("Facebook login error:", err);
      setError(getFriendlyError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithApple();
    } catch (err) {
      console.error("Apple login error:", err);
      setError(getFriendlyError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => !loading && setShowAuthModal(false)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="auth-close-btn" 
          onClick={() => setShowAuthModal(false)}
          disabled={loading}
        >
          ✕
        </button>
        
        {/* Logo/Header */}
        <div className="auth-header text-center">
          <img src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" alt="Logo" className="auth-logo" />
          <h3>The Cheesecake House</h3>
          <p>
            {activeTab === 'forgot' 
              ? 'Recuperare parolă cont' 
              : 'Autentifică-te pentru a plasa comanda'}
          </p>
        </div>

        {/* Tab triggers */}
        {activeTab !== 'forgot' && (
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
              disabled={loading}
            >
              Conectare
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
              disabled={loading}
            >
              Cont nou
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-message">{error}</div>}
          {success && <div className="auth-success-message">{success}</div>}
          
          {/* Expandable Section for Register Fields */}
          <div className={`auth-expandable-section ${activeTab === 'register' ? 'expanded' : ''}`}>
            <div className="auth-expandable-content">
              <div className="auth-field">
                <label htmlFor="reg-name">Nume Complet</label>
                <input 
                  type="text" 
                  id="reg-name" 
                  required={activeTab === 'register'} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Popescu Andrei"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-phone">Număr Telefon</label>
                <input 
                  type="tel" 
                  id="reg-phone" 
                  required={activeTab === 'register'} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 0755 123 456"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="auth-email">Adresă Email</label>
            <input 
              type="email" 
              id="auth-email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: andrei@example.com"
              disabled={loading}
            />
          </div>

          {/* Password field - hidden in forgot password mode */}
          {activeTab !== 'forgot' && (
            <div className="auth-field">
              <label htmlFor="auth-pass">Parolă</label>
              <div className="auth-password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="auth-pass" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="auth-password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Ascunde parola" : "Afișează parola"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="auth-eye-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="auth-eye-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {activeTab === 'login' && (
                <button 
                  type="button" 
                  className="auth-forgot-link" 
                  onClick={() => handleTabChange('forgot')}
                  disabled={loading}
                >
                  Ai uitat parola?
                </button>
              )}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Se încarcă...' : (
              activeTab === 'login' 
                ? 'Conectează-te' 
                : activeTab === 'register' 
                  ? 'Creează contul' 
                  : 'Trimite email de resetare'
            )}
          </button>
          
          {activeTab === 'forgot' && (
            <button 
              type="button" 
              className="auth-back-to-login-btn" 
              onClick={() => handleTabChange('login')}
              disabled={loading}
            >
              Înapoi la conectare
            </button>
          )}
        </form>

        {/* Social Logins - only when not in forgot password mode */}
        {activeTab !== 'forgot' && (
          <div className="auth-social-section">
            <div className="auth-social-divider">
              <span>sau conectează-te cu</span>
            </div>
            
            <div className="auth-social-buttons">
              <button 
                type="button" 
                className="social-btn google-btn" 
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                type="button" 
                className="social-btn facebook-btn" 
                onClick={handleFacebookLogin} 
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" fill="#1877F2"/>
                </svg>
                <span>Facebook</span>
              </button>

              <button 
                type="button" 
                className="social-btn apple-btn" 
                onClick={handleAppleLogin} 
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.11.09 2.24-.55 3-1.43z" fill="currentColor"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
