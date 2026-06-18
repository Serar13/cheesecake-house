import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getActiveProducts, getApprovedReviews } from '../services/catalog';
import { preloadImages } from '../services/prefetch';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './Home.css';

export default function Home() {
  const { t, selectedStore } = useApp();

  const [menuPreviewProducts, setMenuPreviewProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <span className="hero-location-badge">📍 {selectedStore?.name.replace('The Cheesecake House ', '')}</span>
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
          <span className="section-subtitle">Gustul Proaspăt</span>
          <h2 className="section-title">Meniul Nostru</h2>
          <div className="gold-divider"></div>
          <p className="teaser-intro">
            Fiecare felie de cheesecake este pregătită artizanal în laboratoarele noastre, din ingrediente 100% naturale. Descoperă selecția de top.
          </p>

          <div className="teaser-products-preview">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : menuPreviewProducts.length === 0 ? (
              <p className="teaser-intro">Meniul va fi disponibil în curând.</p>
            ) : (
              menuPreviewProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="teaser-cta-row">
            <Link to="/meniu" className="teaser-btn">Vezi Meniul Complet 🍰</Link>
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
              <span className="section-subtitle">Standarde Regale 👑</span>
              <h2 className="section-title">Furnizor al Casei Regale</h2>
              <div className="gold-divider-left"></div>
              <p>
                Suntem onorați să fim singurul furnizor pe partea de cofetărie consemnat de Familia Regală a României. Pasiunea noastră pentru dulciuri se împletește cu respectul pentru tradiție și ingrediente de cea mai bună calitate.
              </p>
              <Link to="/despre-noi" className="teaser-btn">Vezi povestea &amp; reușitele noastre →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Candy Bar Teaser Section */}
      <section className="home-teaser-section alt-bg">
        <div className="teaser-container">
          <div className="candybar-teaser-split">
            <div className="candybar-teaser-text-col text-left">
              <span className="section-subtitle">Evenimente Dulci 👰‍♀️</span>
              <h2 className="section-title">Candy Bar Personalizat</h2>
              <div className="gold-divider-left"></div>
              <p>
                Organizezi o nuntă, un botez sau o petrecere corporate? Îți punem la dispoziție pachete complete cu mini-cheesecakes, deserturi fine la pahar și decor tematic pentru momente memorabile.
              </p>
              <Link to="/candy-bar" className="teaser-btn">Vezi Pachete &amp; Galerie →</Link>
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
                alt="Rezervări Mese" 
                className="about-teaser-img-rounded"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
            <div className="about-teaser-text-col text-left">
              <span className="section-subtitle">Masă în Cofetărie ☕</span>
              <h2 className="section-title">Rezervări Mese</h2>
              <div className="gold-divider-left"></div>
              <p>
                Te așteptăm cu drag în cofetăriile noastre primitoare din Târgu Mureș, Cluj-Napoca și Bistrița. Asigură-ți o masă pentru tine și cei dragi și savurați împreună cele mai fine prăjituri din Transilvania.
              </p>
              <Link to="/rezervari" className="teaser-btn">Rezervă o Masă Online →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4.8. Horizontal Scrolling Reviews Marquee */}
      {reviews.length > 0 && (
        <section className="home-reviews-marquee-section">
          <div className="marquee-header text-center">
            <span className="section-subtitle">Părerile Oaspeților 💬</span>
            <h2 className="section-title">Ce spun clienții noștri</h2>
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
          <span className="section-subtitle">Vino să ne vizitezi 📍</span>
          <h2 className="section-title">Locațiile Noastre</h2>
          <div className="gold-divider"></div>
          <p className="teaser-intro">
            Te așteptăm cu vitrinele pline și cafea proaspătă în laboratoarele noastre din Transilvania.
          </p>

          <div className="cities-pills-row">
            <span className="city-pill">Târgu Mureș</span>
            <span className="city-pill">Cluj-Napoca</span>
            <span className="city-pill">Bistrița</span>
          </div>

          <div className="teaser-cta-row">
            <Link to="/contact" className="teaser-btn">Vezi Program &amp; Detalii Contact ✉️</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
