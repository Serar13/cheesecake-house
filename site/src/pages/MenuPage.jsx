import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getActiveCategories, getActiveProducts } from '../services/catalog';
import { preloadImages } from '../services/prefetch';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useApp();

  useEffect(() => {
    let mounted = true;
    Promise.all([getActiveCategories(), getActiveProducts()])
      .then(async ([cats, prods]) => {
        if (!mounted) return;
        setCategories(cats);
        // Decode the first screenful of imagery before clearing skeletons.
        await preloadImages(prods.slice(0, 8).map((p) => p.image));
        if (!mounted) return;
        setProducts(prods);
        setLoading(false);
      })
      .catch((err) => {
        console.error('MenuPage load failed:', err);
        if (!mounted) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Active products are already filtered by the service; apply category filter.
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <section className="menu-section page-padding-top animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div className="section-header text-center">
        <span className="section-subtitle">{t('menuSubtitle')}</span>
        <h2 className="section-title">{t('menuTitle')}</h2>
        <div className="gold-divider"></div>
      </div>

      {/* Category filtering (categories from Firestore) */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {loading ? (
        <section className="product-grid-container">
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : error ? (
        <div className="no-products-message">
          <span className="no-products-icon">⚠️</span>
          <p>{t('menuLoadError')}</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </section>
  );
}
