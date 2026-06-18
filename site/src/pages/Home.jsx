import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getActiveProducts, getApprovedReviews } from '../services/catalog';
import { preloadImages } from '../services/prefetch';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './Home.css';

export default function Home() {
  const { t, selectedStore, setSelectedStore, locations } = useApp();

  const [menuPreviewProducts, setMenuPreviewProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([getActiveProducts(), getApprovedReviews()])
      .then(async ([prods, revs]) => {
        if (!mounted) return;
        // Prefer featured products for the preview; fall back to the first few.
        const featured = prods.filter(p => p.featured);
        const preview = (featured.length > 0 ? featured : prods).slice(0, 3);
        // Hold the skeletons until the preview imagery has decoded so the
        // section reveals fully-formed with no pop-in.
        await preloadImages(preview.map(p => p.image));
        if (!mounted) return;
        setMenuPreviewProducts(preview);
        setReviews(revs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Home load failed:', err);
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getHeroImage = (storeId) => {
    switch (storeId) {
      case 'tg-mures':
        return '/images/mures_hero_real.jpg';
      case 'cluj-napoca':
        return '/images/cluj_hero_real.jpg';
      case 'bistrita':
        return '/images/bistrita_hero_real.jpg';
      default:
        return '/images/mures_hero_real.jpg';
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* 1. Hero Section */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: `url(${getHeroImage(selectedStore?.id)})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <div className="hero-badge-row">
            <span className="hero-badge">{t('heroBadge')}</span>
            <div className="hero-location-selector">
              <button
                type="button"
                className="hero-location-badge"
                onClick={() => setLocationMenuOpen(open => !open)}
                aria-haspopup="listbox"
                aria-expanded={locationMenuOpen}
              >
                <span>📍 {selectedStore?.name.replace('The Cheesecake House ', '') || t('heroLocationChoose')}</span>
                <span className="hero-location-arrow" aria-hidden="true">{locationMenuOpen ? '▲' : '▼'}</span>
              </button>

              {locationMenuOpen && (
                <div className="hero-location-menu" role="listbox" aria-label={t('heroLocationAria')}>
                  {locations.length === 0 ? (
                    <span className="hero-location-empty">{t('heroLocationLoading')}</span>
                  ) : locations.map(store => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedStore?.id === store.id}
                      className={`hero-location-option ${selectedStore?.id === store.id ? 'active' : ''}`}
                      key={store.id}
                      onClick={() => {
                        setSelectedStore(store);
                        setLocationMenuOpen(false);
                      }}
                    >
                      <strong>{store.name.replace('The Cheesecake House ', '')}</strong>
                      {store.address && <span>{store.address.split(',')[0]}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h1 className="hero-title">The Cheesecake House</h1>
          <p className="hero-subtitle">{t('heroSubtitle')}</p>
          <div className="hero-actions-row">
            <Link to="/meniu" className="hero-btn-primary">{t('heroBtnMenu')}</Link>
            <Link to="/despre-noi" className="hero-btn-secondary">{t('heroBtnAbout')}</Link>
          </div>
        </div>
      </section>

      {/* 2. Menu Teaser Section */}
      <section className="home-teaser-section alt-bg">
        <div className="teaser-container text-center">
          <span className="section-subtitle">{t('homeFreshTaste')}</span>
          <h2 className="section-title">{t('menuTitle')}</h2>
          <div className="gold-divider"></div>
          <p className="teaser-intro">{t('homeMenuIntro')}</p>

          <div className="teaser-products-preview">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : menuPreviewProducts.length === 0 ? (
              <p className="teaser-intro">{t('homeMenuSoon')}</p>
            ) : (
              menuPreviewProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="teaser-cta-row">
            <Link to="/meniu" className="teaser-btn">{t('homeViewFullMenu')}</Link>
          </div>
        </div>
      </section>

      {/* 3. About Us Teaser Section */}
      <section className="home-teaser-section">
        <div className="teaser-container">
          <div className="about-teaser-split">
            <div className="about-teaser-img-col">
              <img 
                src="https://assets.boosteat.com/images/c165/2024-07-08/20240708103119212668bbff7af981/image.png" 
                alt="Furnizor al Casei Regale" 
                className="about-teaser-seal"
              />
            </div>
            <div className="about-teaser-text-col text-left">
              <span className="section-subtitle">{t('homeRoyalSubtitle')}</span>
              <h2 className="section-title">{t('homeRoyalTitle')}</h2>
              <div className="gold-divider-left"></div>
              <p>{t('homeRoyalText')}</p>
              <Link to="/despre-noi" className="teaser-btn">{t('homeRoyalCta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Candy Bar Teaser Section */}
      <section className="home-teaser-section alt-bg">
        <div className="teaser-container">
          <div className="candybar-teaser-split">
            <div className="candybar-teaser-text-col text-left">
              <span className="section-subtitle">{t('homeCandySubtitle')}</span>
              <h2 className="section-title">{t('homeCandyTitle')}</h2>
              <div className="gold-divider-left"></div>
              <p>{t('homeCandyText')}</p>
              <Link to="/candy-bar" className="teaser-btn">{t('homeCandyCta')}</Link>
            </div>
            <div className="candybar-teaser-img-col">
              <img 
                src="/images/cheesecake_jar.png" 
                alt="Candy Bar preview" 
                className="candybar-teaser-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Table Reservations Teaser Section */}
      <section className="home-teaser-section">
        <div className="teaser-container">
          <div className="about-teaser-split">
            <div className="about-teaser-img-col">
              <img 
                src="https://assets.boosteat.com/images/c165/2024-04-11/202404111109122126617c4d828492/image.jpg" 
                alt={t('homeReservationsImageAlt')} 
                className="about-teaser-img-rounded"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
            <div className="about-teaser-text-col text-left">
              <span className="section-subtitle">{t('homeReservationsSubtitle')}</span>
              <h2 className="section-title">{t('homeReservationsTitle')}</h2>
              <div className="gold-divider-left"></div>
              <p>{t('homeReservationsText')}</p>
              <Link to="/rezervari" className="teaser-btn">{t('homeReservationsCta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4.8. Horizontal Scrolling Reviews Marquee */}
      {reviews.length > 0 && (
        <section className="home-reviews-marquee-section">
          <div className="marquee-header text-center">
            <span className="section-subtitle">{t('homeGuestsSubtitle')}</span>
            <h2 className="section-title">{t('homeGuestsTitle')}</h2>
            <div className="gold-divider"></div>
          </div>

          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                <div key={`${review.id}-${idx}`} className="marquee-card">
                  <div className="marquee-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="marquee-text">"{review.text}"</p>
                  <span className="marquee-author">- {review.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Contact Teaser Section */}
      <section className="home-teaser-section alt-bg">
        <div className="teaser-container text-center">
          <span className="section-subtitle">{t('homeVisitSubtitle')}</span>
          <h2 className="section-title">{t('homeVisitTitle')}</h2>
          <div className="gold-divider"></div>
          <p className="teaser-intro">{t('homeVisitText')}</p>

          <div className="cities-pills-row">
            <span className="city-pill">Târgu Mureș</span>
            <span className="city-pill">Cluj-Napoca</span>
            <span className="city-pill">Bistrița</span>
          </div>

          <div className="teaser-cta-row">
            <Link to="/contact" className="teaser-btn">{t('homeVisitCta')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
