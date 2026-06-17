import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { reviews as initialReviews } from '../mockData/menuData';
import './ReviewsPage.css';

export default function ReviewsPage() {
  const { t } = useApp();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewToAdd = {
      id: Date.now(),
      name: newReview.name || 'Anonim',
      rating: Number(newReview.rating),
      text: newReview.text,
      date: 'Chiar acum'
    };
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: '', rating: 5, text: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="reviews-page-section page-padding-top animate-fade-in">
      <div className="reviews-page-container">
        
        {/* Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">{t('reviewsSubtitle')}</span>
          <h2 className="section-title">{t('reviewsTitle')}</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="reviews-page-grid">
          {/* Reviews List */}
          <div className="reviews-list-col">
            <h3>Părerile Oaspeților Noștri</h3>
            <div className="reviews-list-container">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <div className="review-footer">
                    <span className="review-name">{review.name}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave a Review Form */}
          <div className="review-form-col">
            <div className="review-form-card">
              <h3>Spune-ne părerea ta ✍️</h3>
              <p>Experiența ta este extrem de importantă pentru noi. Ajută-ne să devenim mai buni!</p>

              {submitted ? (
                <div className="form-success-alert">
                  <span>✨</span>
                  <h4>Mulțumim pentru recenzie!</h4>
                  <p>Opinia ta a fost publicată cu succes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="new-review-form">
                  <div className="form-field">
                    <label htmlFor="rev-name">Numele Tău</label>
                    <input 
                      type="text" 
                      id="rev-name"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Popescu Ionuț"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="rev-rating">Nota acordată</label>
                    <select 
                      id="rev-rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="form-select"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="rev-text">Recenzia ta</label>
                    <textarea 
                      id="rev-text"
                      rows="4"
                      required
                      value={newReview.text}
                      onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Scrie aici opinia ta despre produsele sau serviciile noastre..."
                    ></textarea>
                  </div>

                  <button type="submit" className="review-submit-btn">
                    Trimite Recenzia
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
