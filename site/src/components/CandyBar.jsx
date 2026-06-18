import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createOfferRequest } from '../services/submissions';
import './CandyBar.css';

export default function CandyBar() {
  const { t, language } = useApp();
  const isRo = language === 'ro';

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const brochureSlides = [
    'https://assets.unlayer.com/projects/0/1781076599848-tinywow_ofertacb_90246948_1.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076614454-tinywow_ofertacb_90246948_2.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076638923-tinywow_ofertacb_90246948_3.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076649625-tinywow_ofertacb_90246948_4.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076659460-tinywow_ofertacb_90246948_5.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076669378-tinywow_ofertacb_90246948_6.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076680050-tinywow_ofertacb_90246948_7.jpg?w=1420px',
    'https://assets.unlayer.com/projects/0/1781076691749-tinywow_ofertacb_90246948_8.jpg?w=1420px',
  ];

  // Calculator state
  const [guestCount, setGuestCount] = useState(100);
  const [includeCake, setIncludeCake] = useState(true);
  const [includeSaratle, setIncludeSaratle] = useState(true);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('Cluj-Napoca');
  const [formServices, setFormServices] = useState({
    candyBar: true,
    tortPrezentare: true,
    marturii: false,
  });
  const [formTheme, setFormTheme] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formGuestsInput, setFormGuestsInput] = useState('100');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // A-la-carte menu items
  const menuItems = [
    {
      name: isRo ? 'Mini Cheesecake' : 'Mini Cheesecake',
      price: '12 RON',
      desc: isRo 
        ? 'Varianta miniaturală a cheesecakes-urilor noastre. Arome la alegere: Căpșuni, Zmeură, Caramel Sărat, Oreo, Snickers, Fistic.' 
        : 'Miniature version of our signature cheesecakes. Available flavors: Strawberry, Raspberry, Salted Caramel, Oreo, Snickers, Pistachio.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120118212645b878ee4599/image.jpeg'
    },
    {
      name: isRo ? 'Cheesecake la Pahar (120g)' : 'Cheesecake in a Jar (120g)',
      price: '15 RON',
      desc: isRo 
        ? 'Shot premium de cheesecake fin așezat în straturi într-un borcan elegant de sticlă, acoperit cu sos de fructe de pădure sau caramel.' 
        : 'Premium cheesecake layered beautifully in an elegant glass jar, topped with fresh berry sauce or rich caramel.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120557212645b88a5f418f/image.jpeg'
    },
    {
      name: isRo ? 'Mini Pavlova' : 'Mini Pavlova',
      price: '15 RON',
      desc: isRo 
        ? 'Coajă fină de bezea crocantă la exterior și moale la interior, umplută cu cremă fină de vanilie și decorată cu fructe proaspete.' 
        : 'Delicate meringue shell, crisp on the outside and soft inside, filled with fine vanilla cream and decorated with fresh fruits.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120611212645b88b3ac05c/image.jpeg'
    },
    {
      name: isRo ? 'Macarons Premium' : 'Premium Macarons',
      price: '6 RON',
      desc: isRo 
        ? 'Biscuiți franțuzești din făină de migdale cu umpluturi cremoase de fistic, ciocolată neagră, zmeură sau caramel sărat.' 
        : 'French almond meringue cookies with rich, creamy fillings of pistachio, dark chocolate, raspberry, or salted caramel.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120633212645b88c9e70d1/image.jpeg'
    },
    {
      name: isRo ? 'Cupcakes Tematice' : 'Themed Cupcakes',
      price: '8 RON',
      desc: isRo 
        ? 'Brioșe pufoase cu morcovi și nuci sau banane, decorate cu o cupolă bogată de cremă de brânză fină.' 
        : 'Fluffy carrot & walnut or banana muffins, decorated with a rich swirl of cream cheese frosting.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120530212645b888a4069f/image.jpeg'
    },
    {
      name: isRo ? 'Sărățele cu Telemea (kg)' : 'Salty Cheese Crackers (kg)',
      price: '60 RON',
      desc: isRo 
        ? 'Sărățele crocante preparate cu unt, telemea maturată și chimen sau mac, perfecte pentru echilibrarea gustului dulce al candy bar-ului.' 
        : 'Crisp savory crackers made with butter, matured local cheese, and cumin or poppy seeds, perfect to balance the sweet bar.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120628212645b88c4558cb/image.jpeg'
    },
    {
      name: isRo ? 'Tort de Prezentare (kg)' : 'Presentation Cake (kg)',
      price: '150 RON',
      desc: isRo 
        ? 'Tort personalizat cu etaje pentru ocazii speciale, îmbrăcat în cremă fină de brânză și decorat cu flori naturale sau fructe.' 
        : 'Custom multi-tiered cake for special occasions, coated in smooth cream cheese frosting and decorated with real flowers or fruits.',
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120548212645b889ca1dc8/image.jpeg'
    }
  ];

  // Carousel handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % brochureSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + brochureSlides.length) % brochureSlides.length);
  };

  // Calculator logic
  const minicakesQty = Math.round(guestCount * 1.2);
  const jarsQty = Math.round(guestCount * 0.6);
  const macaronsQty = Math.round(guestCount * 0.4);
  const pavlovasQty = Math.round(guestCount * 0.2);
  const saratleQty = includeSaratle ? parseFloat((guestCount * 0.015).toFixed(1)) : 0;
  const cakeQty = includeCake ? parseFloat((guestCount * 0.1).toFixed(1)) : 0;

  const minicakesCost = minicakesQty * 12;
  const jarsCost = jarsQty * 15;
  const macaronsCost = macaronsQty * 6;
  const pavlovasCost = pavlovasQty * 15;
  const saratleCost = Math.round(saratleQty * 60);
  const cakeCost = Math.round(cakeQty * 150);

  const totalCostEstimate = minicakesCost + jarsCost + macaronsCost + pavlovasCost + saratleCost + cakeCost;

  // Apply calculator recommendations to form
  const applyCalculatorToForm = () => {
    setFormGuestsInput(guestCount.toString());
    setFormServices({
      candyBar: true,
      tortPrezentare: includeCake,
      marturii: formServices.marturii
    });
    
    const calculatedMessage = isRo 
      ? `Recomandare calculată automat:
- ${minicakesQty} Mini Cheesecakes (Aromă mixtă)
- ${jarsQty} Borcanele de Cheesecake (120g)
- ${macaronsQty} Macarons Premium
- ${pavlovasQty} Mini Pavlova
${includeSaratle ? `- ${saratleQty} kg Sărățele cu telemea\n` : ''}${includeCake ? `- Tort de prezentare de ${cakeQty} kg\n` : ''}
Buget estimat: aprox. ${totalCostEstimate} RON.`
      : `Automatically calculated recommendation:
- ${minicakesQty} Mini Cheesecakes (Mixed flavors)
- ${jarsQty} Cheesecake jars (120g)
- ${macaronsQty} Premium Macarons
- ${pavlovasQty} Mini Pavlova
${includeSaratle ? `- ${saratleQty} kg Savory cheese crackers\n` : ''}${includeCake ? `- Presentation cake: ${cakeQty} kg\n` : ''}
Estimated budget: approx. ${totalCostEstimate} RON.`;

    setFormMessage(calculatedMessage);
    
    // Smooth scroll to form
    const formElement = document.getElementById('quote-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!formName || !formPhone || !formEmail || !formDate) {
      setSubmitError(isRo ? 'Vă rugăm să completați câmpurile obligatorii (*).' : 'Please fill in the required fields (*).');
      return;
    }

    // Build a descriptive message including the selected services, theme and location.
    const selectedServices = Object.entries(formServices)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(', ');
    const composedMessage = [
      formMessage,
      formTheme ? `${isRo ? 'Tematică' : 'Theme'}: ${formTheme}` : '',
      selectedServices ? `${isRo ? 'Servicii' : 'Services'}: ${selectedServices}` : '',
      formLocation ? `${isRo ? 'Locație' : 'Location'}: ${formLocation}` : '',
    ].filter(Boolean).join('\n');

    setSubmitting(true);
    try {
      await createOfferRequest({
        customerName: formName,
        email: formEmail,
        phone: formPhone,
        eventType: 'candybar',
        eventDate: formDate,
        guestCount: parseInt(formGuestsInput, 10) || 0,
        message: composedMessage,
      });
      setFormSuccess(true);
    } catch (err) {
      console.error('createOfferRequest failed:', err);
      setSubmitError(isRo
        ? 'Nu am putut trimite solicitarea. Te rugăm să încerci din nou.'
        : 'We could not send your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="candybar-section">
      <div className="candybar-container">
        
        {/* Header */}
        <div className="candybar-header text-center">
          <span className="section-subtitle">{isRo ? 'Evenimente Memorabile' : 'Unforgettable Events'}</span>
          <h1 className="candybar-main-title">Candy Bar &amp; Torturi</h1>
          <div className="gold-divider"></div>
          <p className="candybar-intro">
            {isRo 
              ? 'Petrecerea perfectă presupune un mix alcătuit din foarte multe elemente, unul dintre acestea fiind candy bar-ul. De aceea, vrem să transformăm fiecare petrecere într-o poveste plină de savoare și culoare. Vă oferim consultanță în alegerea produselor preferate, pentru a crea decorul dorit, îmbinat cu tematica petrecerii.'
              : 'The perfect party is a mix of many elements, and the candy bar is key. We want to transform every event into a story of flavor and color, providing full consulting to match your theme.'}
          </p>
        </div>

        {/* Brochure Slide Carousel */}
        <div className="brochure-carousel-wrapper">
          <h2 className="section-block-title">{isRo ? 'Catalogul Nostru Oficial (Broșură)' : 'Our Official Catalog Brochure'}</h2>
          <p className="section-block-desc">
            {isRo ? 'Răsfoiește paginile ofertei noastre pentru a vizualiza recomandările și decorurile noastre.' : 'Flip through our catalog pages to see event decorations and setups.'}
          </p>
          
          <div className="brochure-carousel">
            <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous slide">⟨</button>
            <div className="carousel-slide-container">
              <img 
                src={brochureSlides[currentSlide]} 
                alt={`Brochure Page ${currentSlide + 1}`} 
                className="brochure-slide-img" 
              />
              <div className="slide-badge">
                {currentSlide + 1} / {brochureSlides.length}
              </div>
            </div>
            <button className="carousel-btn next" onClick={nextSlide} aria-label="Next slide">⟩</button>
          </div>
          
          <div className="carousel-dots">
            {brochureSlides.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Dynamic Calculator Section */}
        <div className="calculator-section">
          <div className="calculator-card">
            <div className="calculator-controls">
              <h3>⚡ {isRo ? 'Calculator de Cantități & Buget' : 'Quantity & Budget Calculator'}</h3>
              <p className="calc-note">
                {isRo 
                  ? 'Alege numărul de invitați pentru a calcula instant sortimentele ideale și costul estimativ:' 
                  : 'Select your guest count to instantly calculate recommended items and estimated cost:'}
              </p>
              
              <div className="control-group">
                <label className="slider-label">
                  <span>👤 {isRo ? 'Număr Invitați:' : 'Number of Guests:'} <strong>{guestCount}</strong></span>
                </label>
                <input 
                  type="range" 
                  min="30" 
                  max="400" 
                  step="5"
                  value={guestCount} 
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="guests-slider"
                />
                <div className="slider-range">
                  <span>30</span>
                  <span>100</span>
                  <span>200</span>
                  <span>300</span>
                  <span>400+</span>
                </div>
              </div>

              <div className="checkbox-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={includeCake} 
                    onChange={(e) => setIncludeCake(e.target.checked)} 
                  />
                  <span>🎂 {isRo ? 'Include Tort de Prezentare (100g / invitat)' : 'Include Presentation Cake (100g / guest)'}</span>
                </label>
                
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={includeSaratle} 
                    onChange={(e) => setIncludeSaratle(e.target.checked)} 
                  />
                  <span>🥨 {isRo ? 'Include Sărățele cu Telemea (15g / invitat)' : 'Include Savory Cheese Crackers (15g / guest)'}</span>
                </label>
              </div>

              <button className="apply-calc-btn" onClick={applyCalculatorToForm}>
                📋 {isRo ? 'Aplică recomandarea în Formular' : 'Apply recommendation to Quote Form'}
              </button>
            </div>

            <div className="calculator-results">
              <h4>📋 {isRo ? 'Configurație Recomandată' : 'Recommended Configuration'}</h4>
              <div className="results-list">
                <div className="result-item">
                  <span className="item-qty">{minicakesQty}x</span>
                  <span className="item-name">Mini Cheesecakes ({isRo ? 'diverse arome' : 'mixed flavors'})</span>
                  <span className="item-cost">{minicakesCost} RON</span>
                </div>
                <div className="result-item">
                  <span className="item-qty">{jarsQty}x</span>
                  <span className="item-name">Cheesecake la Pahar (120g)</span>
                  <span className="item-cost">{jarsCost} RON</span>
                </div>
                <div className="result-item">
                  <span className="item-qty">{macaronsQty}x</span>
                  <span className="item-name">Macarons Premium</span>
                  <span className="item-cost">{macaronsCost} RON</span>
                </div>
                <div className="result-item">
                  <span className="item-qty">{pavlovasQty}x</span>
                  <span className="item-name">Mini Pavlova</span>
                  <span className="item-cost">{pavlovasCost} RON</span>
                </div>
                {includeSaratle && (
                  <div className="result-item">
                    <span className="item-qty">{saratleQty} kg</span>
                    <span className="item-name">{isRo ? 'Sărățele cu telemea' : 'Cheese crackers'}</span>
                    <span className="item-cost">{saratleCost} RON</span>
                  </div>
                )}
                {includeCake && (
                  <div className="result-item highlight">
                    <span className="item-qty">{cakeQty} kg</span>
                    <span className="item-name">{isRo ? 'Tort etajat de prezentare' : 'Presentation tiered cake'}</span>
                    <span className="item-cost">{cakeCost} RON</span>
                  </div>
                )}
              </div>
              
              <div className="results-total">
                <span className="total-label">{isRo ? 'Buget Estimativ:' : 'Estimated Cost:'}</span>
                <span className="total-price">{totalCostEstimate} RON</span>
              </div>
              <span className="calc-disclosure">
                * {isRo ? 'Prețul final poate varia în funcție de personalizări, decoruri și transport.' : 'Final cost may vary based on customization, decorations, and transport.'}
              </span>
            </div>
          </div>
        </div>

        {/* A-La-Carte Catalog Grid */}
        <div className="candy-catalog-wrapper">
          <h2 className="section-block-title">{isRo ? 'Meniu A-La-Carte & Prețuri' : 'A-La-Carte Menu & Prices'}</h2>
          <p className="section-block-desc">
            {isRo ? 'Sortimentele noastre premium care pot fi configurate liber în compoziția candy bar-ului tău.' : 'Our premium sweets that can be customized freely for your special candy bar.'}
          </p>
          
          <div className="candy-catalog-grid">
            {menuItems.map((item, index) => (
              <div key={index} className="candy-card">
                <div className="candy-card-img-wrapper">
                  <img src={item.image} alt={item.name} className="candy-card-img" />
                </div>
                <div className="candy-card-info">
                  <div className="candy-card-header">
                    <h4>{item.name}</h4>
                    <span className="candy-price-tag">{item.price}</span>
                  </div>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Request Form */}
        <div id="quote-form-section" className="quote-form-wrapper">
          <div className="form-card">
            <h3>✉️ {isRo ? 'Solicită o Ofertă Personalizată' : 'Request a Personalized Quote'}</h3>
            <p>
              {isRo 
                ? 'Trimite-ne un mesaj cu detaliile evenimentului tău, iar noi îți răspundem în cel mai scurt timp cu o ofertă dedicată.' 
                : 'Send us details about your event, and we will get back to you with a tailored offer.'}
            </p>
            
            {formSuccess ? (
              <div className="form-success-container animate-fade-in">
                <span className="success-icon">🎉</span>
                <h4>{isRo ? 'Solicitare Trimisă cu Succes!' : 'Quote Request Sent Successfully!'}</h4>
                <p>
                  {isRo 
                    ? 'Îți mulțumim pentru interes! Un consultant The Cheesecake House te va contacta telefonic sau prin e-mail în maxim 24 de ore.' 
                    : 'Thank you! A Cheesecake House event specialist will contact you via phone or email within 24 hours.'}
                </p>
                <button className="reset-btn" onClick={() => setFormSuccess(false)}>
                  {isRo ? 'Trimite o altă solicitare' : 'Send another request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>{isRo ? 'Nume Contact *' : 'Contact Name *'}</label>
                    <input 
                      type="text" 
                      required 
                      placeholder={isRo ? 'Ex: Maria Ionescu' : 'e.g. John Doe'}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{isRo ? 'Număr Contact *' : 'Contact Phone *'}</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="Ex: 07xx xxx xxx"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="Ex: maria@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{isRo ? 'Data Evenimentului *' : 'Event Date *'}</label>
                    <input 
                      type="date" 
                      required 
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{isRo ? 'Locația Evenimentului *' : 'Event Location *'}</label>
                    <select value={formLocation} onChange={(e) => setFormLocation(e.target.value)}>
                      <option value="Cluj-Napoca">Cluj-Napoca</option>
                      <option value="Târgu Mureș">Târgu Mureș</option>
                      <option value="Bistrița">Bistrița</option>
                      <option value="Alta">Alta (În afara acestor orașe)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{isRo ? 'Număr Invitați' : 'Guest Count'}</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 100"
                      value={formGuestsInput}
                      onChange={(e) => setFormGuestsInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group options-group">
                  <label>{isRo ? 'Servicii Dorite' : 'Requested Services'}</label>
                  <div className="checkbox-row">
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={formServices.candyBar} 
                        onChange={(e) => setFormServices({...formServices, candyBar: e.target.checked})}
                      />
                      <span>Candy Bar</span>
                    </label>
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={formServices.tortPrezentare} 
                        onChange={(e) => setFormServices({...formServices, tortPrezentare: e.target.checked})}
                      />
                      <span>{isRo ? 'Tort de prezentare' : 'Presentation cake'}</span>
                    </label>
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={formServices.marturii} 
                        onChange={(e) => setFormServices({...formServices, marturii: e.target.checked})}
                      />
                      <span>{isRo ? 'Mărturii dulci' : 'Sweet favors / testimonials'}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>{isRo ? 'Tematica sau Schema Cromatica' : 'Theme or Color Palette'}</label>
                  <input 
                    type="text" 
                    placeholder={isRo ? 'Ex: Boho-chic, Elegance Gold, Roșu regal' : 'e.g. Vintage, Emerald green, Pastel pink'}
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{isRo ? 'Mesaj / Observații' : 'Message / Special Notes'}</label>
                  <textarea 
                    rows="5" 
                    placeholder={isRo ? 'Aici puteți adăuga detalii speciale despre locație, preferințe pentru arome sau alergii.' : 'Add notes regarding venue, flavor preferences or allergies here.'}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  ></textarea>
                </div>

                {submitError && (
                  <p className="form-error-text" style={{ color: '#c0392b' }}>{submitError}</p>
                )}

                <button type="submit" className="form-submit-btn" disabled={submitting}>
                  ✨ {submitting
                    ? (isRo ? 'Se trimite...' : 'Sending...')
                    : (isRo ? 'Trimite Solicitarea' : 'Send Quote Request')}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
