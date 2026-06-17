import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="no-products-message">
        <span className="no-products-icon">🧁</span>
        <p>Ne pare rău, nu am găsit produse în această categorie momentan.</p>
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
