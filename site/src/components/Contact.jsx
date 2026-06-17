import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { stores } from '../mockData/menuData';
import './Contact.css';

export default function Contact() {
  const { t } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', eventType: 'wedding', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactData({ name: '', email: '', phone: '', eventType: 'wedding', message: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        
        {/* Header */}
        <div className="contact-header text-center">
          <span className="section-subtitle">{t('contactSubtitle')}</span>
          <h2 className="section-title">{t('contactTitle')}</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="contact-grid">
          {/* Store Locations List */}
          <div className="locations-panel">
            <h3>Laboratoarele Noastre</h3>
            <p className="locations-intro-text">Ne găsești în Târgu Mureș, Cluj-Napoca și Bistrița. Te așteptăm cu vitrinele pline de prăjituri proaspete!</p>
            
            <div className="store-cards-list">
              {stores.map(store => (
                <div key={store.id} className="store-location-card">
                  <div className="store-card-header">
                    <span className="store-icon">🏪</span>
                    <h4>{store.name.replace('The Cheesecake House ', '')}</h4>
                  </div>
                  <div className="store-details">
                    <p><strong>📍 Adresă:</strong> {store.address}</p>
                    <p><strong>📞 Telefon:</strong> <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="contact-link">{store.phone}</a></p>
                    <p><strong>✉️ Email:</strong> <a href={`mailto:${store.email}`} className="contact-link">{store.email}</a></p>
                    <p><strong>🕒 Program:</strong> {store.schedule}</p>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    Deschide pe Google Maps 🗺️
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form / Events */}
          <div className="contact-form-panel">
            <div className="form-card">
              <h3>{t('contactFormTitle')}</h3>
              <p>{t('contactFormDesc')}</p>
              
              {formSubmitted ? (
                <div className="form-success-alert">
                  <span>✨</span>
                  <h4>{t('formSuccessTitle')}</h4>
                  <p>{t('formSuccessDesc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="event-contact-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-name">{t('formName')}</label>
                      <input 
                        type="text" 
                        id="contact-name"
                        name="name" 
                        required 
                        value={contactData.name} 
                        onChange={handleInputChange}
                        placeholder="Ex: Ana Maria"
                      />
                    </div>
                  </div>

                  <div className="form-row-two-col">
                    <div className="form-field">
                      <label htmlFor="contact-email">{t('formEmail')}</label>
                      <input 
                        type="email" 
                        id="contact-email"
                        name="email" 
                        required 
                        value={contactData.email} 
                        onChange={handleInputChange}
                        placeholder="Ex: ana@example.com"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-phone">{t('formPhone')}</label>
                      <input 
                        type="tel" 
                        id="contact-phone"
                        name="phone" 
                        required 
                        value={contactData.phone} 
                        onChange={handleInputChange}
                        placeholder="Ex: 07xxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-event">{t('formEventType')}</label>
                    <select 
                      id="contact-event"
                      name="eventType"
                      value={contactData.eventType}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="wedding">{t('formEventWedding')}</option>
                      <option value="baptism">{t('formEventBaptism')}</option>
                      <option value="birthday">{t('formEventBirthday')}</option>
                      <option value="corporate">{t('formEventCorporate')}</option>
                      <option value="other">{t('formEventOther')}</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">{t('formDetails')}</label>
                    <textarea 
                      id="contact-message"
                      name="message" 
                      rows="4" 
                      required 
                      value={contactData.message} 
                      onChange={handleInputChange}
                      placeholder="..."
                    ></textarea>
                  </div>

                  <button type="submit" className="form-submit-btn">
                    {t('formSubmit')}
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
