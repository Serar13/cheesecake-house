import React from 'react';
import { useApp } from '../context/AppContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          loading="lazy"
        />
        <span className="product-weight-badge">{product.weight}</span>
      </div>
      
      <div className="product-info">
        <div className="product-meta">
          <h3 className="product-name">{product.name}</h3>
        </div>
        
        <p className="product-desc">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">{product.price.toFixed(2)}</span>
            <span className="product-currency">RON</span>
            <span className="product-unit">/ {product.unit}</span>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
            aria-label={`Adaugă ${product.name} în coș`}
          >
            Adaugă ➕
          </button>
        </div>
      </div>
    </article>
  );
}
