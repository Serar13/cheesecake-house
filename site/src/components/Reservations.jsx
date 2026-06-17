import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Reservations.css';

export default function Reservations() {
  const { language } = useApp();
  const isRo = language === 'ro';

  const locations = [
    { id: 'tg-mures', name: 'The Cheesecake House Tg. Mures', phone: '+40 757 823 828' },
    { id: 'cluj', name: 'The Cheesecake House Cluj-Napoca', phone: '+40 758 888 888' },
    { id: 'bistrita', name: 'The Cheesecake House Bistrița', phone: '+40 759 999 999' }
  ];

  // Custom seating layouts mapped directly to our generated 3D orthographic floorplans
  const seatingLayouts = {
    'tg-mures': [
      { id: 'T1', label: 'Masa 1', seats: 2, zone: isRo ? 'Lângă Intrare' : 'Near Entrance', x: 29, y: 80 },
      { id: 'T2', label: 'Masa 2', seats: 4, zone: isRo ? 'Zona Centrală (Sus)' : 'Center Zone (Top)', x: 59, y: 40 },
      { id: 'T3', label: 'Masa 3', seats: 4, zone: isRo ? 'Zona Centrală (Mijloc)' : 'Center Zone (Mid)', x: 59, y: 54 },
      { id: 'T4', label: 'Masa 4', seats: 4, zone: isRo ? 'Zona Centrală (Jos)' : 'Center Zone (Bottom)', x: 60, y: 68 },
      { id: 'T5', label: 'Masa 5', seats: 2, zone: isRo ? 'Canapea Sepeu (Sus)' : 'Sofa Booth (Top)', x: 76, y: 36 },
      { id: 'T6', label: 'Masa 6', seats: 2, zone: isRo ? 'Canapea Sepeu (Mijloc-Sus)' : 'Sofa Booth (Mid-Top)', x: 76, y: 49 },
      { id: 'T7', label: 'Masa 7', seats: 2, zone: isRo ? 'Canapea Sepeu (Mijloc-Jos)' : 'Sofa Booth (Mid-Bottom)', x: 76, y: 61 },
      { id: 'T8', label: 'Masa 8', seats: 2, zone: isRo ? 'Canapea Sepeu (Jos)' : 'Sofa Booth (Bottom)', x: 76, y: 74 }
    ],
    'cluj': [
      { id: 'C1', label: 'Masa 1', seats: 2, zone: isRo ? 'Interior Stânga-Jos' : 'Indoor Left-Bottom', x: 17, y: 83 },
      { id: 'C2', label: 'Masa 2', seats: 2, zone: isRo ? 'Interior Centru-Jos' : 'Indoor Center-Bottom', x: 32, y: 83 },
      { id: 'C3', label: 'Masa 3', seats: 2, zone: isRo ? 'Interior Stânga-Mijloc' : 'Indoor Left-Mid', x: 17, y: 71 },
      { id: 'C4', label: 'Masa 4', seats: 2, zone: isRo ? 'Interior Centru-Mijloc' : 'Indoor Center-Mid', x: 32, y: 71 },
      { id: 'C5', label: 'Masa 5', seats: 2, zone: isRo ? 'Interior Stânga-Sus' : 'Indoor Left-Top', x: 17, y: 58.5 },
      { id: 'C6', label: 'Masa 6', seats: 2, zone: isRo ? 'Interior Centru-Sus' : 'Indoor Center-Top', x: 32, y: 58.5 },
      { id: 'C7', label: 'Masa 7', seats: 2, zone: isRo ? 'Interior Stânga-Fiecare (Sus)' : 'Indoor Left-Top (Upper)', x: 17, y: 45.5 },
      { id: 'C8', label: 'Masa 8', seats: 2, zone: isRo ? 'Interior Dreapta-Jos (Lângă Bucătărie)' : 'Indoor Right-Bottom (Near Kitchen)', x: 49.5, y: 83 },
      { id: 'C9', label: 'Masa 9', seats: 4, zone: isRo ? 'Terasă Outdoor (Sus)' : 'Outdoor Terrace (Top)', x: 79, y: 30.5 },
      { id: 'C10', label: 'Masa 10', seats: 4, zone: isRo ? 'Terasă Outdoor (Mijloc)' : 'Outdoor Terrace (Mid)', x: 79, y: 55 },
      { id: 'C11', label: 'Masa 11', seats: 4, zone: isRo ? 'Terasă Outdoor (Jos)' : 'Outdoor Terrace (Bottom)', x: 79, y: 76.5 }
    ],
    'bistrita': [
      { id: 'B1', label: 'Masa 1', seats: 2, zone: isRo ? 'Arcadă Stânga' : 'Arch Left', x: 26.5, y: 31 },
      { id: 'B2', label: 'Masa 2', seats: 2, zone: isRo ? 'Arcadă Centru-Stânga' : 'Arch Center-Left', x: 38.5, y: 30.5 },
      { id: 'B3', label: 'Masa 3', seats: 2, zone: isRo ? 'Arcadă Centru-Dreapta' : 'Arch Center-Right', x: 51, y: 30.5 },
      { id: 'B4', label: 'Masa 4', seats: 2, zone: isRo ? 'Arcadă Dreapta' : 'Arch Right', x: 63, y: 31 },
      { id: 'B5', label: 'Masa 5', seats: 2, zone: isRo ? 'Mijloc Stânga' : 'Center Left', x: 27, y: 49.5 },
      { id: 'B6', label: 'Masa 6', seats: 2, zone: isRo ? 'Mijloc Dreapta' : 'Center Right', x: 44, y: 47 },
      { id: 'B7', label: 'Masa 7', seats: 2, zone: isRo ? 'Boutique Stânga-Jos' : 'Boutique Left-Bottom', x: 25.5, y: 72 }
    ]
  };

  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
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

  const activeLocation = locations[selectedLocIndex];
  const currentLayout = seatingLayouts[activeLocation.id] || [];

  // Deterministic booked tables generator based on date, time, and location
  const getBookedTables = () => {
    const hashInput = `${activeLocation.id}-${formDate}-${formTime}`;
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      hash = hashInput.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const booked = [];
    currentLayout.forEach((table, index) => {
      // Deterministically book around 30-40% of tables
      const seed = Math.abs((hash + index * 12345) % 10);
      if (seed < 3.5) { 
        booked.push(table.id);
      }
    });
    return booked;
  };

  const bookedTableIds = getBookedTables();

  // Reset selected table if it gets booked due to date/time change or if location changes
  useEffect(() => {
    setSelectedTableId(null);
  }, [selectedLocIndex, formDate, formTime]);

  const handleTableClick = (table) => {
    if (bookedTableIds.includes(table.id)) return;
    setSelectedTableId(prev => prev === table.id ? null : table.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formPhone || !formEmail || !formDate || !formTime) {
      alert(isRo ? 'Vă rugăm să completați toate câmpurile obligatorii (*).' : 'Please fill in all the required fields (*).');
      return;
    }
    setFormSuccess(true);
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

  const selectedTableObj = currentLayout.find(t => t.id === selectedTableId);

  // Return the specific floorplan background image for each location
  const getFloorPlanBgImage = () => {
    if (activeLocation.id === 'cluj') return '/cluj_layout_3d.png';
    if (activeLocation.id === 'bistrita') return '/bistrita_layout_3d.png';
    return '/tg_mures_floorplan.png';
  };

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
                  value={selectedLocIndex} 
                  onChange={(e) => setSelectedLocIndex(parseInt(e.target.value))}
                  className="location-meta-select"
                >
                  {locations.map((loc, idx) => (
                    <option key={loc.id} value={idx}>{loc.name}</option>
                  ))}
                </select>
              </div>

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
            </div>

            {formSuccess ? (
              <div className="reservation-success-container animate-fade-in">
                <span className="success-badge-icon">🎉</span>
                <h3>{isRo ? 'Rezervare Înregistrată!' : 'Reservation Submitted!'}</h3>
                <p className="success-summary">
                  {isRo 
                    ? `Te așteptăm la ${activeLocation.name.replace('The Cheesecake House ', '')} pe data de ${formDate} la ora ${formTime} (${formGuests} persoane).`
                    : `We are waiting for you at ${activeLocation.name.replace('The Cheesecake House ', '')} on ${formDate} at ${formTime} (${formGuests} people).`}
                </p>
                {selectedTableObj && (
                  <p className="success-table-summary">
                    📍 {isRo ? `Masa ta selectată: ${selectedTableObj.label} (${selectedTableObj.zone})` : `Your selected table: ${selectedTableObj.label} (${selectedTableObj.zone})`}
                  </p>
                )}
                <p className="success-desc">
                  {isRo 
                    ? 'Un e-mail de confirmare a fost trimis. Te rugăm să ajungi cu maxim 10 minute înainte de ora selectată.' 
                    : 'A confirmation email has been sent. Please arrive 10 minutes prior to your booking.'}
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

                {/* Seating Layout Map Section */}
                <div className="seating-map-group">
                  <label className="map-group-label">
                    🗺️ {isRo ? 'Selectează Masa pe Hartă' : 'Select Seating Map Table'}
                  </label>
                  <p className="map-group-desc">
                    {isRo 
                      ? 'Fă clic direct pe masa ta preferată din schema 3D a localului pentru a o rezerva.' 
                      : 'Click directly on your preferred table inside the 3D-rendered shop layout map to book it.'}
                  </p>

                  {/* Seating Room Plan Map */}
                  <div 
                    className="floor-plan-map"
                    style={{ backgroundImage: `url(${getFloorPlanBgImage()})` }}
                  >
                    {currentLayout.map(table => {
                      const isBooked = bookedTableIds.includes(table.id);
                      const isSelected = selectedTableId === table.id;
                      
                      let tableClass = 'table-node';
                      if (isBooked) tableClass += ' booked';
                      if (isSelected) tableClass += ' selected';

                      return (
                        <button
                          key={table.id}
                          type="button"
                          className={tableClass}
                          style={{ left: `${table.x}%`, top: `${table.y}%` }}
                          onClick={() => handleTableClick(table)}
                          disabled={isBooked}
                          title={`${table.label} - ${table.seats} ${isRo ? 'locuri' : 'seats'} (${table.zone}) - ${isBooked ? (isRo ? 'Ocupată' : 'Booked') : (isRo ? 'Liberă' : 'Free')}`}
                        >
                          <span className="table-label-node">{table.id.replace(/[A-Z]/g, '')}</span>
                          <span className="table-seats-count">{table.seats}p</span>
                          {isSelected && <span className="selected-indicator-checkmark">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Map Legend */}
                  <div className="map-legend">
                    <div className="legend-item">
                      <span className="legend-color free"></span>
                      <span>{isRo ? 'Liberă' : 'Available'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color booked"></span>
                      <span>{isRo ? 'Rezervată' : 'Occupied'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color selected"></span>
                      <span>{isRo ? 'Selecția Ta' : 'Your Choice'}</span>
                    </div>
                  </div>

                  {selectedTableObj && (
                    <div className="selected-table-callout animate-fade-in">
                      🎉 {isRo 
                        ? `Ai selectat Masa ${selectedTableObj.id.replace(/[A-Z]/g, '')} (${selectedTableObj.seats} locuri, amplasată ${selectedTableObj.zone}).` 
                        : `You selected Table ${selectedTableObj.id.replace(/[A-Z]/g, '')} (${selectedTableObj.seats} seats, located ${selectedTableObj.zone}).`}
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

                <button type="submit" className="reservations-submit-btn">
                  ✨ {isRo ? 'Trimite' : 'Submit Booking'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
