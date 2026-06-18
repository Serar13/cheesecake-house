import { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Download, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Zap,
  CheckCircle2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import './App.css';

export default function App() {
  // Package Selection:
  // - 'individual': Servicii la bucată
  // - 'lite': Pachet Lite Accelerator (750 €/lună)
  // - 'launch': Pachet Launch Accelerator (1000 €/lună, Recomandat)
  const [activePackage, setActivePackage] = useState('launch');

  // URL-ul site-ului demo creat deja pentru client (inlocuieste cu link-ul tau real)
  const demoSiteUrl = "https://cheesecakehouse.ro";

  // Simulatorul de Notificări Push & Aplicație Mobilă
  const [phoneState, setPhoneState] = useState('lock'); // 'lock' | 'splash'
  const [notifications, setNotifications] = useState([]);
  const [, setIsPlayingScenario] = useState(false);
  const [splashStep, setSplashStep] = useState('loading'); // 'loading' | 'fadeOutLogo' | 'surprise'
  const [tappedNotifId, setTappedNotifId] = useState(null);
  const [showVirtualCursor, setShowVirtualCursor] = useState(false);

  const timeoutsRef = useRef([]);
  const phoneWrapperRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("AudioContext is blocked or not supported", e);
    }
  };

  const sendPushNotification = (title, body) => {
    playChime();
    const newNotif = {
      id: Date.now() + Math.random(),
      title,
      body,
      time: "acum"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const runDemoScenario = () => {
    // Curățăm orice timeout-uri anterioare sau stări active
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    setNotifications([]);
    setPhoneState('lock');
    setSplashStep('loading');
    setShowVirtualCursor(false);
    setTappedNotifId(null);
    setIsPlayingScenario(true);

    // Secunda 1: The Cheesecake House (Cuptor Cald)
    const t1 = setTimeout(() => {
      sendPushNotification(
        "The Cheesecake House 🍰", 
        "Alina tocmai a scos din cuptor o tavă caldă de Cheesecake cu fistic. Treci pe la noi în următoarea oră și ai 20% reducere!"
      );
    }, 1000);

    // Secunda 3: Fidelitate
    const t2 = setTimeout(() => {
      sendPushNotification(
        "Fidelitate 🎁", 
        "Sarah, mai ai doar o ștampilă până la felia ta gratuită de Red Velvet. Ne vedem azi?"
      );
    }, 3000);

    // Secunda 5: Masa ta e gata
    const t3 = setTimeout(() => {
      sendPushNotification(
        "Masa ta e gata! ✅", 
        "Rezervarea ta pentru 4 persoane în locația din Cluj-Napoca este confirmată pentru ora 19:30."
      );
    }, 5000);

    // Secunda 6.5: Afișăm cursorul virtual deasupra notificării de Fidelitate
    const t4 = setTimeout(() => {
      setShowVirtualCursor(true);
    }, 6500);

    // Secunda 7.2: Simulăm apăsarea (aplicăm clasa de apăsare notificării de Fidelitate)
    const t5 = setTimeout(() => {
      setNotifications(prev => {
        const fidelitate = prev.find(n => n.title.includes("Fidelitate"));
        if (fidelitate) {
          setTappedNotifId(fidelitate.id);
        }
        return prev;
      });
    }, 7200);

    // Secunda 7.6: Trecem la splash screen (starea 'loading')
    const t6 = setTimeout(() => {
      setShowVirtualCursor(false);
      setPhoneState('splash');
      setSplashStep('loading');
    }, 7600);

    // Secunda 9.6 (după 2s de loading): Pornim fade-out-ul logo-ului
    const t7 = setTimeout(() => {
      setSplashStep('fadeOutLogo');
    }, 9600);

    // Secunda 10.2 (după 0.6s de fade-out): Afișăm mesajul de surpriză
    const t8 = setTimeout(() => {
      setSplashStep('surprise');
      setIsPlayingScenario(false);
    }, 10200);

    timeoutsRef.current = [t1, t2, t3, t4, t5, t6, t7, t8];
  };

  const handleNotificationClick = (id) => {
    // Oprim rularea campaniilor pe lockscreen
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlayingScenario(false);
    setShowVirtualCursor(false);
    setTappedNotifId(id);

    // Trecem la splash screen-ul aplicației
    setPhoneState('splash');
    setSplashStep('loading');

    // După 2 secunde, pornim fade-out-ul logo-ului
    const tSplash1 = setTimeout(() => {
      setSplashStep('fadeOutLogo');
    }, 2000);

    // După încă 0.6 secunde, afișăm mesajul de surpriză
    const tSplash2 = setTimeout(() => {
      setSplashStep('surprise');
    }, 2600);

    timeoutsRef.current = [tSplash1, tSplash2];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            runDemoScenario();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (phoneWrapperRef.current) {
      observer.observe(phoneWrapperRef.current);
    }

    return () => {
      observer.disconnect();
      timeoutsRef.current.forEach(clearTimeout);
    };
    // The demo must auto-run only once when the phone first enters the viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  return (
    <div className="animate-fade">
      {/* HEADER NAVIGATION */}
      <nav className="proposal-nav">
        <div className="proposal-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" 
            alt="The Cheesecake House Logo" 
            className="nav-logo"
            style={{ height: '44px' }}
          />
        </div>
      </nav>

      {/* HERO / INTRO SECTION */}
      <header className="hero-section">
        <div className="proposal-container">
          <div className="client-badge">
            <Sparkles size={14} fill="currentColor" />
            <span>Propus exclusiv pentru: The Cheesecake House</span>
          </div>
          
          <h1>Propunere de <span>Parteneriat Digital</span></h1>
          <p className="hero-subtitle">
            Soluție digitală completă și integrată: Web Development, Mobile Application & Social Media Management
          </p>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '15px', color: '#64748b' }}>
            Această propunere B2B reprezintă strategia noastră de a unifica prezența digitală a magazinelor 
            <strong> The Cheesecake House</strong> (Târgu Mureș, Cluj-Napoca, Bistrița) sub o singură umbrelă 
            tehnologică modernă. Înlocuim serviciile fragmentate cu un ecosistem optimizat pentru fidelizarea clienților și creșterea vânzărilor directe.
          </p>

          {/* DRAFT LIVE & SATISFACTION GUARANTEE BANNER */}
          <div className="demo-banner">
            <span className="demo-badge">DRAFT LIVE DISPONIBIL</span>
            <p className="demo-banner-text">
              Am dezvoltat deja o versiune de lucru interactivă (draft) pentru noul site web! O puteți naviga și testa direct de pe telefon sau calculator:
            </p>
            <div style={{ marginTop: '12px', marginBottom: '8px' }}>
              <a href={demoSiteUrl} target="_blank" rel="noopener noreferrer" className="demo-banner-link">
                <span>Vizualizează site-ul web creat</span>
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="demo-guarantee">
              <strong>🛡️ Garanție Zero Risc:</strong> Propunem o colaborare bazată pe rezultate palpabile. Plătiți dezvoltarea platformei doar dacă sunteți pe deplin mulțumiți de produsul final. În caz contrar, costurile sunt zero.
            </p>
          </div>
        </div>
      </header>

      {/* INTERACTIVE TOGGLE SWITCH */}
      <section className="toggle-switch-container">
        <div className="toggle-pill toggle-pill-3way">
          <div 
            className="toggle-indicator toggle-indicator-3way" 
            style={{
              left: activePackage === 'individual' ? '5px' : activePackage === 'lite' ? 'calc(33.33% + 2px)' : 'calc(66.66% - 1px)',
              width: 'calc(33.33% - 6px)',
              backgroundColor: activePackage === 'individual' ? '#ffffff' : activePackage === 'lite' ? 'var(--color-primary-hover)' : 'var(--color-primary)',
              boxShadow: activePackage === 'individual' ? 'var(--shadow-sm)' : '0 4px 12px rgba(59, 130, 246, 0.25)'
            }}
          />
          
          <div 
            className={`toggle-option ${activePackage === 'individual' ? 'active' : ''}`}
            onClick={() => setActivePackage('individual')}
          >
            Servicii la bucată
          </div>
          
          <div 
            className={`toggle-option recommended ${activePackage === 'lite' ? 'active' : ''}`}
            onClick={() => setActivePackage('lite')}
            style={{ color: activePackage === 'lite' ? '#ffffff' : '' }}
          >
            <span>Pachet Lite</span>
            <span className="discount-badge" style={{ backgroundColor: '#10b981' }}>Salvezi 1200€</span>
          </div>
          
          <div 
            className={`toggle-option recommended ${activePackage === 'launch' ? 'active' : ''}`}
            onClick={() => setActivePackage('launch')}
            style={{ color: activePackage === 'launch' ? '#ffffff' : '' }}
          >
            <span>Pachet Launch</span>
            <span className="discount-badge">Salvezi 1500€</span>
          </div>
        </div>
      </section>

      {/* DYNAMIC DEVELOPMENT PRICING SECTION */}
      <section className="proposal-container" style={{ marginBottom: '20px' }}>
        <h2 className="pricing-section-title">
          {activePackage !== 'individual' ? "Faza 1: Dezvoltare Ecosistem Digital (Prețuri Pachet)" : "Dezvoltare Tehnică Servicii Individuale"}
        </h2>
        
        <div className="pricing-grid">
          {/* Card 1: Web Development */}
          <div className={`pricing-card ${activePackage !== 'individual' ? 'accelerator-active' : ''}`}>
            <div>
              <div className="card-header-icon">
                <Globe size={24} />
              </div>
              <h3>Platformă Web Premium</h3>
              <p className="card-desc">Site de prezentare ultra-modern cu meniu interactiv, comenzi rapide și rezervări online.</p>
              
              <div className="card-demo-link-container">
                <a href={demoSiteUrl} target="_blank" rel="noopener noreferrer" className="card-demo-link">
                  <span>Vezi site-ul de prezentare creat ↗</span>
                </a>
              </div>
              
              <ul className="features-list">
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Design responsive, personalizat (optimizat pentru mobil)</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Panou de administrare Firestore (produse, stocuri, rezervări)</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Configurat SEO complet & viteză de încărcare ultra-rapidă</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Integrări Google Maps, locații dinamice și formulare feedback</span>
                </li>
              </ul>
            </div>
            
            <div className="card-price-container">
              <div className="price-row">
                {activePackage === 'individual' ? (
                  <span className="price-main price-transition">500 €</span>
                ) : activePackage === 'lite' ? (
                  <>
                    <span className="price-slash price-transition">500 €</span>
                    <span className="price-main price-transition" style={{ color: 'var(--color-primary)' }}>300 €</span>
                  </>
                ) : (
                  <>
                    <span className="price-slash price-transition">500 €</span>
                    <span className="price-indicator-text price-transition">
                      <CheckCircle2 size={14} /> Inclus în Pachetul Launch
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Plată unică, proprietate deplină a codului sursă.</p>
            </div>
          </div>

          {/* Card 2: Mobile App Development */}
          <div className={`pricing-card ${activePackage !== 'individual' ? 'accelerator-active' : ''}`}>
            <div>
              <div className="card-header-icon">
                <Smartphone size={24} />
              </div>
              <h3>Aplicație Mobilă Nativă (iOS & Android)</h3>
              <p className="card-desc">Aplicație mobilă de fidelitate, portofel digital și notificări push directe.</p>
              
              <ul className="features-list">
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Ecrane intuitive: Meniu, Portofel, Card ștampile, Rezervări</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Card digital de fidelitate (9 ștampile = 1 felie gratuită)</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Portofel digital cu reîncărcare, vouchere și coduri de scanare QR</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span>Sistem de Notificări Push (anunțuri instantaneu pe ecranele clienților)</span>
                </li>
              </ul>
            </div>
            
            <div className="card-price-container">
              <div className="price-row">
                {activePackage === 'individual' ? (
                  <span className="price-main price-transition">2.500 €</span>
                ) : (
                  <>
                    <span className="price-slash price-transition">2.500 €</span>
                    <span className="price-main price-transition" style={{ color: 'var(--color-primary)' }}>1.500 €</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                {activePackage === 'individual' ? "Preț standard pentru dezvoltare aplicație dedicată." : activePackage === 'lite' ? "Primești aplicația mobilă la preț redus de partener." : "Primești site-ul web inclus + aplicația mobilă la preț redus."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SNEAK PEEK MOBILE APP SECTION */}
      <section className="proposal-container" style={{ marginBottom: '80px' }}>
        <div className="sneak-peek-container">
          <div className="sneak-peek-grid">
            <div className="sneak-peek-image-box" style={{ flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <div className="phone-mockup" ref={phoneWrapperRef}>
                {/* Dynamic notch island */}
                <div className="phone-dynamic-island" />
                
                {/* 1. Lock Screen UI */}
                {phoneState === 'lock' && (
                  <div className="phone-lockscreen">
                    {/* Status Bar */}
                    <div className="phone-status-bar-lock">
                      <span>01:17</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Clock & Date */}
                    <div className="lockscreen-clock">
                      <span className="lockscreen-date-lbl">Joi, 18 Iunie</span>
                      <span className="lockscreen-time-lbl">01:17</span>
                    </div>

                    {/* Notification Center Tray */}
                    <div className="lockscreen-notification-tray">
                      {notifications.length === 0 ? (
                        <div className="lockscreen-empty-feed">
                          Se trimit notificări în timp real... 🔔
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isTapped = notif.id === tappedNotifId;
                          const isFidelitate = notif.title.includes("Fidelitate");
                          return (
                            <div 
                              key={notif.id} 
                              className={`ios-notification animate-slide-in clickable-notification ${isTapped ? 'simulated-active' : ''}`}
                              onClick={() => handleNotificationClick(notif.id)}
                              style={{ position: 'relative' }}
                            >
                              <div className="ios-notification-header">
                                <div className="ios-app-brand">
                                  <img 
                                    src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" 
                                    className="ios-app-icon" 
                                    alt="Logo" 
                                  />
                                  <span className="ios-app-title">CHEESECAKE HOUSE</span>
                                </div>
                                <span className="ios-time-lbl">{notif.time}</span>
                              </div>
                              <div className="ios-notification-body">
                                <h5>{notif.title}</h5>
                                <p>{notif.body}</p>
                              </div>

                              {/* Cursor virtual suprapus pe notificare */}
                              {showVirtualCursor && isFidelitate && (
                                <div className="virtual-tap-cursor" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Lock Screen Actions */}
                    <div className="lockscreen-actions-row">
                      <div className="lockscreen-circle-btn">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" /></svg>
                      </div>
                      <div className="lockscreen-indicator-bar" />
                      <div className="lockscreen-circle-btn">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Splash Screen UI — faithful reproduction of the real mobile SplashScreen */}
                {phoneState === 'splash' && (
                  <div className="phone-splash-screen animate-fade-in">
                    <div className="phone-status-bar-app">
                      <span>01:17</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Center stage: holds the brand block while loading, then the
                        surprise message — both perfectly centred between the status
                        bar and the home indicator. */}
                    <div className="splash-stage">
                      {splashStep !== 'surprise' && (
                        <div className={`splash-logo-container ${splashStep === 'fadeOutLogo' ? 'animate-fade-out' : ''}`}>
                          <img
                            src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png"
                            alt="Cheesecake House Logo"
                            className="splash-brand-logo"
                          />
                          <h4 className="splash-brand-name">The Cheesecake House</h4>
                          <p className="splash-brand-tagline">Premium Craft Cakes</p>
                        </div>
                      )}

                      {splashStep === 'surprise' && (
                        <div className="splash-surprise-container animate-fade-in">
                          <p className="surprise-text">
                            Mai bine nu, haide să nu stricăm surpriza. 😉
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Loader pinned near the bottom, matching the mobile layout */}
                    {splashStep !== 'surprise' && (
                      <div className={`splash-loader ${splashStep === 'fadeOutLogo' ? 'animate-fade-out' : ''}`}>
                        <div className="splash-spinner"></div>
                        <p className="splash-loading-text">Se încarcă sortimentele delicioase...</p>
                      </div>
                    )}

                    <div className="lockscreen-indicator-bar dark-color" />
                  </div>
                )}
              </div>

              {/* Minimal restart link/button */}
              <div className="restart-demo-container">
                <button 
                  className="restart-demo-link" 
                  onClick={runDemoScenario}
                  title="Resetează simularea și pornește notificările push de la început"
                >
                  <RotateCcw size={14} />
                  <span>Reia Prezentarea 🔁</span>
                </button>
              </div>
            </div>
            
            <div className="sneak-peek-text-box">
              <span className="sneak-peek-badge">SIMULATOR LUNĂ DE START</span>
              <h2>Puterea Marketingului Direct</h2>
              <p style={{ marginBottom: '20px', fontSize: '15.5px', lineHeight: '1.6' }}>
                Acest simulator demonstrează cum aplicația mobilă devine cel mai puternic canal de comunicare cu clienții. Trimiți campanii instant direct pe ecranul blocat (Lock Screen), ocolind aglomerația din mail sau rețelele sociale.
              </p>

              {/* WHY THIS IS POWERFUL ACCENT BOX */}
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                borderLeft: '4px solid var(--color-primary)',
                padding: '16px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '24px',
                fontSize: '14.5px',
                lineHeight: '1.5',
                color: 'var(--color-text-muted)'
              }}>
                <strong>💡 De ce este tare:</strong> Îi face pe clienți să realizeze puterea marketing-ului direct. Mesajele ajung instantaneu, au o rată de deschidere de <strong>98%</strong> și costă <strong>0 €</strong> (fără intermediari, fără algoritmi social media).
              </div>
              
              <div className="sneak-peek-features">
                <div className="peek-feature-item">
                  <div className="peek-feature-number">1</div>
                  <div>
                    <h4>Notificări la Cuptor Cald (Geo-fenced / Programate)</h4>
                    <p style={{ fontSize: '14px' }}>
                      Clienții din apropierea magazinului primesc o alertă push când un nou lot de cheesecake-uri (fistic, San Sebastian) este proaspăt scos din cuptor. Atrage instant trafic pietonal în locație.
                    </p>
                  </div>
                </div>
                
                <div className="peek-feature-item">
                  <div className="peek-feature-number">2</div>
                  <div>
                    <h4>Notificări de Loialitate & Recompense</h4>
                    <p style={{ fontSize: '14px' }}>
                      Sistemul îi amintește automat clientului (ex: Sarah) când mai are nevoie de o singură ștampilă până la felia gratuită, stimulând o vizită repetată în acea zi.
                    </p>
                  </div>
                </div>
                
                <div className="peek-feature-item">
                  <div className="peek-feature-number">3</div>
                  <div>
                    <h4>Confirmări Instantanee & Rezervări</h4>
                    <p style={{ fontSize: '14px' }}>
                      Clienții primesc confirmări push în timp real pentru rezervările de mese făcute la Cluj, Bistrița sau Mureș, ridicând nivelul de încredere în serviciile brandului.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA comparative section */}
      <section className="social-section">
        <div className="proposal-container">
          <div className="social-header">
            <h2>Management Profesional Social Media</h2>
            <p>Construim o comunitate activă și promovăm produsele Cheesecake House prin conținut video și imagini de înaltă calitate.</p>
          </div>

          <div className="social-grid">
            {/* Package 1: Social Growth */}
            <div className="social-card">
              <div>
                <h3 style={{ color: 'var(--color-text-main)' }}>Pachetul Social Media Standard</h3>
                <div className="monthly-price">750 €<span> / lună</span></div>
                
                <ul className="social-features">
                  <li>
                    <Check size={16} />
                    <span><strong>12 Postări / lună</strong> (grid, imagini editate profesional)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span><strong>20 Stories / lună</strong> (promovare oferte, interacțiune)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Copywriting personalizat, cercetare hashtags & scheduling</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Recomandări tematice de content lunar</span>
                  </li>
                </ul>
              </div>
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', fontSize: '13.5px', color: '#64748b' }}>
                Ideal pentru menținerea unei imagini constante și curate în mediul online.
              </div>
            </div>

            {/* Package 2: Social Growth + Content */}
            <div className="social-card highlighted">
              <div>
                <h3 style={{ color: 'var(--color-text-main)' }}>Pachetul Social Media + Content Creation</h3>
                <div className="monthly-price" style={{ color: 'var(--color-primary)' }}>1.000 €<span> / lună</span></div>
                
                <ul className="social-features">
                  <li>
                    <Check size={16} />
                    <span><strong>24 Postări / lună</strong> (include grafici, carusele și materiale video)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span><strong>30 - 40 Stories / lună</strong> (acoperire zilnică a activității)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Copywriting dedicat, interacțiune cu comunitatea & setări campanii</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span><strong>Realizare conținut video original (Reels / TikTok)</strong></span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span><strong>PLUS: Apariții personale ale Alinei în videoclipuri</strong></span>
                  </li>
                </ul>
              </div>
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', fontSize: '13.5px', color: 'var(--color-primary)' }}>
                Focus masiv pe video marketing (Reels/TikTok) cu rezultate directe în creșterea vânzărilor fizice și online.
              </div>
            </div>

            {/* Package 3: Custom / Tailored */}
            <div className="social-card">
              <div>
                <h3 style={{ color: 'var(--color-text-main)' }}>Pachet Personalizat (Custom)</h3>
                <div className="monthly-price" style={{ fontSize: '26px', margin: '8px 0 24px', color: 'var(--color-text-main)' }}>
                  Negociabil <span>/ la cerere</span>
                </div>
                
                <ul className="social-features">
                  <li>
                    <Check size={16} />
                    <span><strong>Volum flexibil de postări</strong> (adaptat nevoilor și bugetului)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span><strong>Focalizare pe anumite rețele</strong> (ex. doar Instagram + TikTok)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Administrare campanii de promovare (Ads) cu bugete variabile</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Servicii extra opționale (ședințe foto/video dedicate în locație)</span>
                  </li>
                </ul>
              </div>
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', fontSize: '13.5px', color: '#64748b' }}>
                Doriți o structură diferită sau un volum mai mic? Discutăm detaliile și negociem un preț personalizat.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARD: ACCELERATOR PACKAGE DETAILS */}
      <section className="proposal-container accelerator-focus-section">
        <div className={`accelerator-card ${activePackage !== 'individual' ? 'active' : ''}`}>
          <div className="card-top-tag">
            <Zap size={14} fill="currentColor" />
            <span>Pachet Recomandat de Parteneriat</span>
          </div>
          
          <h2>{activePackage === 'lite' ? "Pachetul Complet: Lite Accelerator" : "Pachetul Complet: Launch Accelerator"}</h2>
          <p className="intro-text">
            O strategie în 3 etape concepută pentru a lansa rapid produsele The Cheesecake House în mediul digital, 
            asigurând asistență tehnică completă și bugete controlate de promovare directă.
          </p>

          <div className="steps-list">
            {/* Step 1 */}
            <div className="step-row">
              <div className="step-badge">1</div>
              <div className="step-details">
                <h4>Etapa 1: Dezvoltare & Configurare (Luna 1)</h4>
                <p>
                  Dezvoltăm site-ul web de prezentare și aplicațiile mobile dedicate pentru iOS & Android. Integrăm portofelul 
                  digital și sistemul de ștampile din baza de date Firestore. 
                </p>
                {activePackage === 'lite' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Cost Dezvoltare: 1.800 € plată unică (reducere de 1.200€ - Site: 300€ + App: 1.500€)
                  </span>
                )}
                {activePackage === 'launch' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Cost Dezvoltare: 1.500 € plată unică (reducere de 1.500€ - Site: Inclus + App: 1.500€)
                  </span>
                )}
                {activePackage === 'individual' && (
                  <span className="step-pricing">
                    Cost Dezvoltare: Conform serviciilor selectate (Site Web: 500€, Aplicatie: 2.500€)
                  </span>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-row">
              <div className="step-badge">2</div>
              <div className="step-details">
                <h4>Etapa 2: Lansare & Promovare Activă (Luni 1-3 sau 1-6)</h4>
                <p>
                  Pornim motoarele de marketing. Administrăm campaniile pe Facebook, Instagram și TikTok, investind 400€ direct ca buget publicitar (Ads) pentru a atrage clienți noi în magazinele fizice din Mureș, Cluj și Bistrița. Mentenanța tehnică a aplicației și a site-ului este complet gratuită în această perioadă.
                </p>
                {activePackage === 'lite' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Abonament: 750 € / lună (Include 350€ servicii Socials + 400€ Buget Ads integrat + Mentenanță GRATUITĂ)
                  </span>
                )}
                {activePackage === 'launch' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Abonament: 1.000 € / lună (Include 600€ servicii Socials + 400€ Buget Ads integrat + Mentenanță GRATUITĂ)
                  </span>
                )}
                {activePackage === 'individual' && (
                  <span className="step-pricing">
                    Abonament: În funcție de serviciile contractate (Fără reduceri de pachet)
                  </span>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-row">
              <div className="step-badge">3</div>
              <div className="step-details">
                <h4>Etapa 3: Continuitate & Scalare (Din luna 4 sau 7)</h4>
                <p>
                  Trecem în faza de optimizare. Continuăm promovarea activă și mentenanța tehnică lunară pentru ca ecosistemul 
                  să ruleze fără probleme. Mentenanța este redusă la un cost special de 100€ în loc de 250€ în afara pachetului.
                </p>
                {activePackage === 'lite' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Abonament: 1.250 € / lună (Include servicii Social Media Standard 750€ + administrare campanii Ads + Mentenanță tehnică 100€)
                  </span>
                )}
                {activePackage === 'launch' && (
                  <span className="step-pricing" style={{ color: 'var(--color-primary)' }}>
                    Abonament: 1.500 € / lună (Include servicii Social Media full 1000€ + administrare campanii Ads + Mentenanță tehnică 100€)
                  </span>
                )}
                {activePackage === 'individual' && (
                  <span className="step-pricing">
                    Abonament: La cerere, conform serviciilor active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION & PDF EXPORT SECTION */}
      <section className="proposal-container" style={{ marginBottom: '80px' }}>
        <div className="cta-section">
          <h2>Sună ca planul de dezvoltare de care aveți nevoie?</h2>
          <p>
            Descărcați propunerea în format PDF pentru a salva detaliile ofertei și contactați-ne pentru a programa 
            ședința de kick-off în care vom stabili direcția vizuală și calendarul de lansare.
          </p>
          
          <div className="cta-buttons-group">
            <a href="#" className="btn btn-primary" onClick={handlePrint}>
              <Download size={16} />
              <span>Descarcă Propunerea în format PDF</span>
            </a>
          </div>
          
          <p className="cta-tip">
            * Sfat: Fișierul PDF descărcat este formatat automat pentru printare curată în format A4 (2 pagini).
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="proposal-footer">
        <div className="proposal-container">
          <p>Propus cu încredere și profesionalism de 🤝 <strong>partenerul tău digital</strong>, 2026.</p>
          <p style={{ fontSize: '12px', marginTop: '6px', color: '#94a3b8' }}>
            Această ofertă comercială este confidențială și destinată exclusiv managementului The Cheesecake House.
          </p>
        </div>
      </footer>
    </div>
  );
}
