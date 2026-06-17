import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products } from '../mockData/menuData';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useApp();

  // Filter products by active category
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

      {/* Category filtering */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Product listing grid */}
      <ProductGrid products={filteredProducts} />
    </section>
  );
}
