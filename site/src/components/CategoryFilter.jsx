import React from 'react';
import { useApp } from '../context/AppContext';
import './CategoryFilter.css';

export default function CategoryFilter({ categories = [], activeCategory, onCategoryChange }) {
  const { t } = useApp();

  return (
    <div className="category-filter-wrapper">
      <div className="category-filter-container">
        <button
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          <span className="category-icon">🌟</span>
          <span className="category-name">{t('menuAll')}</span>
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
