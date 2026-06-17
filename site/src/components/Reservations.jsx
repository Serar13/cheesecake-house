import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getActiveLocations } from '../services/catalog';
import {
  getTablesByLocation,
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

export default function Reservations() {
  const { language, currentUser, setShowAuthModal } = useApp();
  const isRo = language === 'ro';

  // Locations + tables loaded from Firestore.
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

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

  // Load active locations.
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
    return () => {
      mounted = false;
    };
  }, []);

  // Load tables when the location changes.
  useEffect(() => {
    if (!selectedLocId) {
      setTables([]);
      return;
    }
    let mounted = true;
    setTablesLoading(true);
    setSelectedTableId(null);
    getTablesByLocation(selectedLocId)
      .then((tbls) => {
        if (!mounted) return;
        setTables(tbls);
        setTablesLoading(false);
      })
      .catch((err) => {
        console.error('Reservations tables load failed:', err);
        if (!mounted) return;
        setTables([]);
        setTablesLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedLocId]);

  const activeLocation = locations.find((l) => l.id === selectedLocId) || null;
  const selectedTableObj = tables.find((t) => t.id === selectedTableId) || null;
  const activeMapImage = activeLocation ? LOCATION_MAP_IMAGES[activeLocation.id] : null;

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
      setFormError(isRo
        ? 'Vă rugăm să completați toate câmpurile obligatorii (*).'
        : 'Please fill in all the required fields (*).');
      return;
    }

    if (!selectedTableId) {
      setFormError(isRo
        ? 'Vă rugăm să selectați o masă.'
        : 'Please select a table.');
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
        setFormError(isRo
          ? 'Masa selectată este deja rezervată la această dată și oră. Te rugăm să alegi alt interval sau altă masă.'
          : 'The selected table is already booked for this date and time. Please choose another slot or table.');
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
      setFormError(isRo
        ? 'Nu am putut înregistra rezervarea. Te rugăm să încerci din nou.'
        : 'We could not submit your reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const guestOptions = [
    { value: '1', label: isRo ? '1 Persoană' : '1 Person' },
    { value: '2', label: isRo ? '2 Persoane' : '2 People' },
    { value: '3', label: isRo ? '3 Persoane' : '3 People' },
    { value: '4', label: isRo ? '4 Persoane' : '4 People' },
    { value: '5', label: isRo ? '5 Persoane' : '5 People' },
    { value: '6', label: isRo ? '6 Persoane' : '6 People' },
    { value: '7', label: isRo ? '7 Persoane' : '7 People' },
    { value: '8', label: isRo ? '8 Persoane' : '8 People' },
    { value: '9', label: isRo ? '9 Persoane' : '9 People' },
    { value: '10+', label: isRo ? 'Grup mare (10+ persoane)' : 'Large Group (10+ people)' },
  ];

  const timeOptions = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <section className="reservations-section">
      <div className="reservations-container">

        {/* Header */}
        <div className="reservations-header text-center">
          <span className="section-subtitle">{isRo ? 'Rezervă o Masă' : 'Book a Table'}</span>
          <h1 className="reservations-main-title">{isRo ? 'Rezervări' : 'Reservations'}</h1>
          <div className="gold-divider"></div>
          <p className="reservations-intro">
            {isRo
              ? 'Te așteptăm cu drag în cofetăriile noastre primitoare. Rezervă o masă din timp pentru a te asigura că savurezi cheesecake-ul tău preferat alături de cei dragi.'
              : 'We welcome you to our cozy shops. Reserve a table in advance to ensure you enjoy your favorite cheesecake with friends and family.'}
          </p>
        </div>

        <div className="reservations-card-wrapper">
          <div className="reservations-card">

            {/* Top location & Phone info */}
            <div className="reservations-meta-top">
              <div className="location-select-group">
                <label className="input-label-meta">{isRo ? 'Alege Locația' : 'Choose Location'}</label>
                <select
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(e.target.value)}
                  className="location-meta-select"
                  disabled={locationsLoading || locations.length === 0}
                >
                  {locationsLoading && <option>{isRo ? 'Se încarcă...' : 'Loading...'}</option>}
                  {!locationsLoading && locations.length === 0 && (
                    <option>{isRo ? 'Nicio locație disponibilă' : 'No locations available'}</option>
                  )}
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {activeLocation && activeLocation.phone && (
                <div className="phone-reservation-banner">
                  <div className="phone-banner-content">
                    <span className="phone-banner-label">{isRo ? 'Rezervări telefonice:' : 'Phone bookings:'}</span>
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
                <h3>{isRo ? 'Rezervare Înregistrată!' : 'Reservation Submitted!'}</h3>
                <p className="success-summary">
                  {isRo
                    ? `Te așteptăm la ${activeLocation ? activeLocation.name.replace('The Cheesecake House ', '') : ''} pe data de ${formDate} la ora ${formTime} (${formGuests} persoane).`
                    : `We are waiting for you at ${activeLocation ? activeLocation.name.replace('The Cheesecake House ', '') : ''} on ${formDate} at ${formTime} (${formGuests} people).`}
                </p>
                {selectedTableObj && (
                  <p className="success-table-summary">
                    📍 {isRo ? `Masa ta selectată: ${selectedTableObj.name}` : `Your selected table: ${selectedTableObj.name}`}
                  </p>
                )}
                <p className="success-desc">
                  {isRo
                    ? 'Rezervarea ta este în așteptarea confirmării. Te vom contacta în scurt timp.'
                    : 'Your reservation is pending confirmation. We will contact you shortly.'}
                </p>
                <button className="reset-reservation-btn" onClick={() => setFormSuccess(false)}>
                  {isRo ? 'Efectuează o altă rezervare' : 'Book another table'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reservations-form">

                <div className="form-group-item">
                  <label>{isRo ? 'Numele tău *' : 'Your name *'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isRo ? 'Ex: Mihai Popescu' : 'e.g. John Smith'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group-item">
                  <label>{isRo ? 'Telefon *' : 'Phone *'}</label>
                  <div className="phone-input-with-flag">
                    <div className="flag-container">
                      <span className="romania-flag">🇷🇴</span>
                      <span className="flag-code">+40</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 7xx xxx xxx"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label>{isRo ? 'Email *' : 'Email *'}</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: mihaipopescu@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="form-group-item">
                  <label>{isRo ? 'Numărul de persoane' : 'Number of Guests'}</label>
                  <select value={formGuests} onChange={(e) => setFormGuests(e.target.value)}>
                    {guestOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-double-column">
                  <div className="form-group-item">
                    <label>{isRo ? 'Ziua *' : 'Date *'}</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>{isRo ? 'Ora *' : 'Time *'}</label>
                    <select value={formTime} onChange={(e) => setFormTime(e.target.value)}>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table selection (from Firestore) */}
                <div className="seating-map-group">
                  <label className="map-group-label">
                    🪑 {isRo ? 'Selectează Masa' : 'Select a Table'}
                  </label>
                  <p className="map-group-desc">
                    {isRo
                      ? 'Alege masa preferată pentru rezervarea ta.'
                      : 'Pick your preferred table for this reservation.'}
                  </p>

                  {tablesLoading ? (
                    <p>{isRo ? 'Se încarcă mesele...' : 'Loading tables...'}</p>
                  ) : tables.length === 0 ? (
                    <p>{isRo ? 'Nicio masă disponibilă pentru această locație.' : 'No tables available for this location.'}</p>
                  ) : (
                    <div
                      className={`floor-plan-map location-map-${activeLocation?.id || 'default'}`}
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
                            title={`${table.name}${table.seats ? ` - ${table.seats} ${isRo ? 'locuri' : 'seats'}` : ''}`}
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

                  {tables.length > 0 && !tablesLoading && (
                    <div className="map-legend">
                      <span className="legend-item"><span className="legend-color free"></span>{isRo ? 'Disponibilă' : 'Available'}</span>
                      <span className="legend-item"><span className="legend-color selected"></span>{isRo ? 'Selectată' : 'Selected'}</span>
                    </div>
                  )}

                  {selectedTableObj && (
                    <div className="selected-table-callout animate-fade-in">
                      🎉 {isRo
                        ? `Ai selectat ${selectedTableObj.name}${selectedTableObj.seats ? ` (${selectedTableObj.seats} locuri)` : ''}.`
                        : `You selected ${selectedTableObj.name}${selectedTableObj.seats ? ` (${selectedTableObj.seats} seats)` : ''}.`}
                    </div>
                  )}
                </div>

                <div className="form-group-item">
                  <label>{isRo ? 'Mesajul tău' : 'Your message'}</label>
                  <textarea
                    rows="4"
                    placeholder={isRo ? 'Adaugă mențiuni speciale, de ex. preferințe pentru masă de fumători/nefumători, scaun pentru copii.' : 'Add special requests, e.g. window table, child seat.'}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  ></textarea>
                </div>

                {!currentUser && (
                  <p className="map-group-desc">
                    🔒 {isRo
                      ? 'Trebuie să fii autentificat pentru a trimite o rezervare.'
                      : 'You must be signed in to submit a reservation.'}
                  </p>
                )}

                {formError && (
                  <p className="form-error-text" style={{ color: '#c0392b' }}>{formError}</p>
                )}

                <button type="submit" className="reservations-submit-btn" disabled={submitting}>
                  ✨ {submitting
                    ? (isRo ? 'Se trimite...' : 'Submitting...')
                    : (isRo ? 'Trimite' : 'Submit Booking')}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
