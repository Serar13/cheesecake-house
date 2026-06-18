import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getApprovedReviews } from '../services/catalog';
import { createReview } from '../services/submissions';
import './ReviewsPage.css';

export default function ReviewsPage() {
  const { t } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    getApprovedReviews()
      .then((revs) => {
        if (!mounted) return;
        setReviews(revs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ReviewsPage load failed:', err);
        if (!mounted) return;
        setLoadError(true);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await createReview({
        name: newReview.name || t('reviewsAnonymous'),
        rating: Number(newReview.rating),
        text: newReview.text,
      });
      setNewReview({ name: '', rating: 5, text: '' });
      setSubmitted(true);
    } catch (err) {
      console.error('createReview failed:', err);
      setSubmitError(t('reviewsSubmitError'));
    } finally {
      setSubmitting(false);
    }
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
            <h3>{t('reviewsListTitle')}</h3>
            <div className="reviews-list-container">
              {loading ? (
                <p>{t('reviewsLoading')}</p>
              ) : loadError ? (
                <p>{t('reviewsLoadError')}</p>
              ) : reviews.length === 0 ? (
                <p>{t('reviewsEmpty')}</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="review-text">"{review.text}"</p>
                    <div className="review-footer">
                      <span className="review-name">{review.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leave a Review Form */}
          <div className="review-form-col">
            <div className="review-form-card">
              <h3>{t('reviewsFormTitle')}</h3>
              <p>{t('reviewsFormDesc')}</p>

              {submitted ? (
                <div className="form-success-alert">
                  <span>✨</span>
                  <h4>{t('reviewsSuccessTitle')}</h4>
                  <p>{t('reviewsSuccessDesc')}</p>
                  <button
                    type="button"
                    className="review-submit-btn"
                    style={{ marginTop: '16px' }}
                    onClick={() => setSubmitted(false)}
                  >
                    {t('reviewsSubmitAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="new-review-form">
                  <div className="form-field">
                    <label htmlFor="rev-name">{t('reviewsName')}</label>
                    <input
                      type="text"
                      id="rev-name"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('reviewsNamePlaceholder')}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="rev-rating">{t('reviewsRating')}</label>
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
                    <label htmlFor="rev-text">{t('reviewsText')}</label>
                    <textarea
                      id="rev-text"
                      rows="4"
                      required
                      value={newReview.text}
                      onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                      placeholder={t('reviewsTextPlaceholder')}
                    ></textarea>
                  </div>

                  {submitError && (
                    <p className="form-error-text" style={{ color: '#c0392b' }}>{submitError}</p>
                  )}

                  <button type="submit" className="review-submit-btn" disabled={submitting}>
                    {submitting ? t('sendingGeneric') : t('reviewsSubmit')}
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
