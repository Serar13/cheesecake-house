import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getActiveLocations } from '../services/catalog';
import {
  createReservation,
  checkReservationConflict,
} from '../services/submissions';
import './Reservations.css';

const RESERVATION_DURATION_MINUTES = 90;

const LOCATION_MAP_IMAGES = {
  'cluj-napoca': '/cluj_layout_3d.png',
  bistrita: '/bistrita_layout_3d.png',
  'tg-mures': '/tg_mures_floorplan.png',
};

/**
 * Static floor-plan table definitions — positions (x%, y%) are calibrated
 * pixel-by-pixel against each location's rendered floor plan image.
 * Update here if the floor plan images ever change.
 */
const STATIC_FLOOR_PLANS = {
  'cluj-napoca': [
    { id: 'cluj-1',  name: 'Masa 1',  seats: 2, x: 16, y: 47 },
    { id: 'cluj-2',  name: 'Masa 2',  seats: 2, x: 16, y: 59 },
    { id: 'cluj-3',  name: 'Masa 3',  seats: 2, x: 27, y: 59 },
    { id: 'cluj-4',  name: 'Masa 4',  seats: 4, x: 16, y: 71 },
    { id: 'cluj-5',  name: 'Masa 5',  seats: 4, x: 27, y: 71 },
    { id: 'cluj-6',  name: 'Masa 6',  seats: 2, x: 16, y: 82 },
    { id: 'cluj-7',  name: 'Masa 7',  seats: 2, x: 27, y: 82 },
    { id: 'cluj-8',  name: 'Masa 8',  seats: 4, x: 40, y: 82 },
    { id: 'cluj-9',  name: 'Masa 9',  seats: 4, x: 71, y: 30 },
    { id: 'cluj-10', name: 'Masa 10', seats: 4, x: 71, y: 52 },
    { id: 'cluj-11', name: 'Masa 11', seats: 4, x: 71, y: 74 },
  ],
  bistrita: [
    { id: 'bistrita-1', name: 'Masa 1', seats: 2, x: 22, y: 35 },
    { id: 'bistrita-2', name: 'Masa 2', seats: 2, x: 37, y: 35 },
    { id: 'bistrita-3', name: 'Masa 3', seats: 2, x: 52, y: 35 },
    { id: 'bistrita-4', name: 'Masa 4', seats: 4, x: 64, y: 35 },
    { id: 'bistrita-5', name: 'Masa 5', seats: 2, x: 24, y: 52 },
    { id: 'bistrita-6', name: 'Masa 6', seats: 4, x: 40, y: 52 },
    { id: 'bistrita-7', name: 'Masa 7', seats: 2, x: 19, y: 72 },
    { id: 'bistrita-8', name: 'Masa 8', seats: 4, x: 33, y: 72 },
    { id: 'bistrita-9', name: 'Masa 9', seats: 4, x: 79, y: 55 },
  ],
  'tg-mures': [
    { id: 'mures-1', name: 'Masa 1', seats: 2, x: 18, y: 80 },
    { id: 'mures-2', name: 'Masa 2', seats: 4, x: 38, y: 38 },
    { id: 'mures-3', name: 'Masa 3', seats: 2, x: 57, y: 35 },
    { id: 'mures-4', name: 'Masa 4', seats: 4, x: 38, y: 62 },
    { id: 'mures-5', name: 'Masa 5', seats: 2, x: 56, y: 62 },
    { id: 'mures-6', name: 'Masa 6', seats: 2, x: 77, y: 31 },
    { id: 'mures-7', name: 'Masa 7', seats: 4, x: 88, y: 48 },
    { id: 'mures-8', name: 'Masa 8', seats: 4, x: 77, y: 73 },
  ],
};

export default function Reservations() {
  const { currentUser, setShowAuthModal, t, language } = useApp();

  // Locations loaded from Firestore (name, phone, address only).
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const [selectedLocId, setSelectedLocId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGuests, setFormGuests] = useState('2');
  const [formDate, setFormDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [formTime, setFormTime] = useState('18:00');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Pre-fill name from logged in user.
  useEffect(() => {
    if (currentUser) {
      setFormName((prev) => prev || currentUser.name || '');
      setFormEmail((prev) => prev || currentUser.email || '');
      setFormPhone((prev) => prev || currentUser.phone || '');
    }
  }, [currentUser]);

  // Load active locations (for display info only — table positions are static).
  useEffect(() => {
    let mounted = true;
    getActiveLocations()
      .then((locs) => {
        if (!mounted) return;
        setLocations(locs);
        setLocationsLoading(false);
        if (locs.length > 0) setSelectedLocId(locs[0].id);
      })
      .catch((err) => {
        console.error('Reservations locations load failed:', err);
        if (!mounted) return;
        setLocationsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Reset selected table when location changes.
  useEffect(() => { setSelectedTableId(null); }, [selectedLocId]);

  // Tables come from the static floor-plan config — no Firestore query needed.
  const tables = STATIC_FLOOR_PLANS[selectedLocId] || [];

  const activeLocation = locations.find((l) => l.id === selectedLocId) || null;
  const selectedTableObj = tables.find((t) => t.id === selectedTableId) || null;
  const activeMapImage = selectedLocId ? LOCATION_MAP_IMAGES[selectedLocId] : null;

  const handleTableClick = (table) => {
    setSelectedTableId((prev) => (prev === table.id ? null : table.id));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!formName || !formPhone || !formEmail || !formDate || !formTime || !selectedLocId) {
      setFormError(t('reservationsErrorRequired'));
      return;
    }

    if (!selectedTableId) {
      setFormError(t('reservationsErrorTable'));
      return;
    }

    setSubmitting(true);
    try {
      const conflict = await checkReservationConflict({
        tableId: selectedTableId,
        date: formDate,
        time: formTime,
        durationMinutes: RESERVATION_DURATION_MINUTES,
      });

      if (conflict) {
        setFormError(t('reservationsErrorConflict'));
        setSubmitting(false);
        return;
      }

      const guestsNum = formGuests === '10+' ? 10 : parseInt(formGuests, 10) || 1;

      await createReservation({
        userId: currentUser.uid,
        customerName: formName,
        locationId: selectedLocId,
        tableId: selectedTableId,
        date: formDate,
        time: formTime,
        durationMinutes: RESERVATION_DURATION_MINUTES,
        guests: guestsNum,
        notes: formMessage,
      });

      setFormSuccess(true);
    } catch (err) {
      console.error('createReservation failed:', err);
      setFormError(t('reservationsErrorSubmit'));
    } finally {
      setSubmitting(false);
    }
  };

  const guestOptions = Array.from({ length: 9 }, (_, index) => {
    const value = String(index + 1);
    const suffix = language === 'hu' ? 'fő' : language === 'en' ? (index === 0 ? 'Person' : 'People') : (index === 0 ? 'Persoană' : 'Persoane');
    return { value, label: `${value} ${suffix}` };
  }).concat({
    value: '10+',
    label: language === 'hu' ? 'Nagy csoport (10+ fő)' : language === 'en' ? 'Large Group (10+ people)' : 'Grup mare (10+ persoane)',
  });

  const timeOptions = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <section className="reservations-section">
      <div className="reservations-container">

        {/* Header */}
        <div className="reservations-header text-center">
          <span className="section-subtitle">{t('reservationsSubtitle')}</span>
          <h1 className="reservations-main-title">{t('reservationsTitle')}</h1>
          <div className="gold-divider"></div>
          <p className="reservations-intro">{t('reservationsIntro')}</p>
        </div>

        <div className="reservations-card-wrapper">
          <div className="reservations-card">

            {/* Top location & Phone info */}
            <div className="reservations-meta-top">
              <div className="location-select-group">
                <label className="input-label-meta">{t('reservationsChooseLocation')}</label>
                <select
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(e.target.value)}
                  className="location-meta-select"
                  disabled={locationsLoading || locations.length === 0}
                >
                  {locationsLoading && <option>{t('loadingGeneric')}</option>}
                  {!locationsLoading && locations.length === 0 && (
                    <option>{t('reservationsNoLocations')}</option>
                  )}
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {activeLocation && activeLocation.phone && (
                <div className="phone-reservation-banner">
                  <div className="phone-banner-content">
                    <span className="phone-banner-label">{t('reservationsPhoneBookings')}</span>
                    <a href={`tel:${activeLocation.phone.replace(/\s+/g, '')}`} className="phone-banner-number">
                      {activeLocation.phone}
                    </a>
                  </div>
                  <a href={`tel:${activeLocation.phone.replace(/\s+/g, '')}`} className="phone-call-btn" aria-label="Call location">
                    📞
                  </a>
                </div>
              )}
            </div>

            {formSuccess ? (
              <div className="reservation-success-container animate-fade-in">
                <span className="success-badge-icon">🎉</span>
                <h3>{t('reservationsSuccessTitle')}</h3>
                <p className="success-summary">
                  {`${t('reservationsSuccessSummaryPrefix')} ${activeLocation ? activeLocation.name.replace('The Cheesecake House ', '') : ''} ${t('reservationsSuccessSummaryMiddle')} ${formDate} ${t('reservationsSuccessSummaryAt')} ${formTime} (${formGuests} ${t('reservationsSuccessPeople')}).`}
                </p>
                {selectedTableObj && (
                  <p className="success-table-summary">
                    📍 {`${t('reservationsSelectedTable')} ${selectedTableObj.name}`}
                  </p>
                )}
                <p className="success-desc">{t('reservationsSuccessDesc')}</p>
                <button className="reset-reservation-btn" onClick={() => setFormSuccess(false)}>
                  {t('reservationsBookAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reservations-form">

                <div className="form-group-item">
                  <label>{t('reservationsName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('reservationsNamePlaceholder')}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group-item">
                  <label>{t('reservationsPhone')}</label>
                  <div className="phone-input-with-flag">
                    <div className="flag-container">
                      <span className="romania-flag">🇷🇴</span>
                      <span className="flag-code">+40</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder={t('reservationsPhonePlaceholder')}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label>{t('reservationsEmail')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('reservationsEmailPlaceholder')}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="form-group-item">
                  <label>{t('reservationsGuests')}</label>
                  <select value={formGuests} onChange={(e) => setFormGuests(e.target.value)}>
                    {guestOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-double-column">
                  <div className="form-group-item">
                    <label>{t('reservationsDate')}</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>{t('reservationsTime')}</label>
                    <select value={formTime} onChange={(e) => setFormTime(e.target.value)}>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Static floor-plan table selection */}
                <div className="seating-map-group">
                  <label className="map-group-label">
                    🪑 {t('reservationsSelectTable')}
                  </label>
                  <p className="map-group-desc">
                    {t('reservationsSelectTableDesc')}
                  </p>

                  {tables.length === 0 ? (
                    <p>{t('reservationsNoTables')}</p>
                  ) : (
                    <div
                      className={`floor-plan-map location-map-${selectedLocId || 'default'}`}
                      style={activeMapImage ? { backgroundImage: `url(${activeMapImage})` } : undefined}
                    >
                      {tables.map((table) => {
                        const isSelected = selectedTableId === table.id;
                        const x = Number(table.x ?? 50);
                        const y = Number(table.y ?? 50);
                        return (
                          <button
                            key={table.id}
                            type="button"
                            className={`table-node ${isSelected ? 'selected' : ''}`}
                            style={{ left: `${x}%`, top: `${y}%` }}
                            onClick={() => handleTableClick(table)}
                            title={`${table.name}${table.seats ? ` - ${table.seats} ${t('reservationsSeats')}` : ''}`}
                          >
                            <span className="table-label-node">{table.name}</span>
                            {table.seats != null && (
                              <span className="table-seats-count">{table.seats}p</span>
                            )}
                            {isSelected && <span className="selected-indicator-checkmark">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {tables.length > 0 && (
                    <div className="map-legend">
                      <span className="legend-item"><span className="legend-color free"></span>{t('reservationsAvailable')}</span>
                      <span className="legend-item"><span className="legend-color selected"></span>{t('reservationsSelected')}</span>
                    </div>
                  )}

                  {selectedTableObj && (
                    <div className="selected-table-callout animate-fade-in">
                      🎉 {`${t('reservationsSelectedCalloutPrefix')} ${selectedTableObj.name}${selectedTableObj.seats ? ` (${selectedTableObj.seats} ${t('reservationsSeats')})` : ''}.`}
                    </div>
                  )}
                </div>

                <div className="form-group-item">
                  <label>{t('reservationsMessage')}</label>
                  <textarea
                    rows="4"
                    placeholder={t('reservationsMessagePlaceholder')}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  ></textarea>
                </div>

                {!currentUser && (
                  <p className="map-group-desc">
                    🔒 {t('reservationsAuthHint')}
                  </p>
                )}

                {formError && (
                  <p className="form-error-text" style={{ color: '#c0392b' }}>{formError}</p>
                )}

                <button type="submit" className="reservations-submit-btn" disabled={submitting}>
                  ✨ {submitting ? t('reservationsSubmitting') : t('reservationsSubmit')}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
