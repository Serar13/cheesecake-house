import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  const { t } = useApp();

  if (products.length === 0) {
    return (
      <div className="no-products-message">
        <span className="no-products-icon">🧁</span>
        <p>{t('menuEmptyCategory')}</p>
      </div>
    );
  }

  return (
    <section className="product-grid-container">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
