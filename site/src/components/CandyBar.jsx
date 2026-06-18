import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createOfferRequest } from '../services/submissions';
import './CandyBar.css';

export default function CandyBar() {
  const { t, language } = useApp();
  const pick = (ro, en, hu) => {
    if (language === 'hu') return hu;
    if (language === 'en') return en;
    return ro;
  };

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
      name: 'Mini Cheesecake',
      price: '12 RON',
      desc: pick('Varianta miniaturală a cheesecakes-urilor noastre. Arome la alegere: Căpșuni, Zmeură, Caramel Sărat, Oreo, Snickers, Fistic.', 'Miniature version of our signature cheesecakes. Available flavors: Strawberry, Raspberry, Salted Caramel, Oreo, Snickers, Pistachio.', 'Saját cheesecakes-eink miniatűr változata. Elérhető ízek: eper, málna, sós karamell, Oreo, Snickers, pisztácia.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120118212645b878ee4599/image.jpeg'
    },
    {
      name: pick('Cheesecake la Pahar (120g)', 'Cheesecake in a Jar (120g)', 'Poharas Cheesecake (120g)'),
      price: '15 RON',
      desc: pick('Shot premium de cheesecake fin așezat în straturi într-un borcan elegant de sticlă, acoperit cu sos de fructe de pădure sau caramel.', 'Premium cheesecake layered beautifully in an elegant glass jar, topped with fresh berry sauce or rich caramel.', 'Prémium cheesecake elegáns üvegpohárban rétegezve, erdei gyümölcsös szósszal vagy karamellel a tetején.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120557212645b88a5f418f/image.jpeg'
    },
    {
      name: 'Mini Pavlova',
      price: '15 RON',
      desc: pick('Coajă fină de bezea crocantă la exterior și moale la interior, umplută cu cremă fină de vanilie și decorată cu fructe proaspete.', 'Delicate meringue shell, crisp on the outside and soft inside, filled with fine vanilla cream and decorated with fresh fruits.', 'Finom habcsókhéj, kívül roppanós, belül puha, vaníliakrémmel töltve és friss gyümölcsökkel díszítve.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120611212645b88b3ac05c/image.jpeg'
    },
    {
      name: pick('Macarons Premium', 'Premium Macarons', 'Prémium Macaronok'),
      price: '6 RON',
      desc: pick('Biscuiți franțuzești din făină de migdale cu umpluturi cremoase de fistic, ciocolată neagră, zmeură sau caramel sărat.', 'French almond meringue cookies with rich, creamy fillings of pistachio, dark chocolate, raspberry, or salted caramel.', 'Francia mandulalisztes macaronok gazdag pisztáciás, étcsokoládés, málnás vagy sós karamellás töltelékkel.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120633212645b88c9e70d1/image.jpeg'
    },
    {
      name: pick('Cupcakes Tematice', 'Themed Cupcakes', 'Tematikus Cupcake-ek'),
      price: '8 RON',
      desc: pick('Brioșe pufoase cu morcovi și nuci sau banane, decorate cu o cupolă bogată de cremă de brânză fină.', 'Fluffy carrot & walnut or banana muffins, decorated with a rich swirl of cream cheese frosting.', 'Puha répa-diós vagy banános muffinok gazdag krémsajtos toppinggal.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120530212645b888a4069f/image.jpeg'
    },
    {
      name: pick('Sărățele cu Telemea (kg)', 'Salty Cheese Crackers (kg)', 'Sós sajtos rudak (kg)'),
      price: '60 RON',
      desc: pick('Sărățele crocante preparate cu unt, telemea maturată și chimen sau mac, perfecte pentru echilibrarea gustului dulce al candy bar-ului.', 'Crisp savory crackers made with butter, matured local cheese, and cumin or poppy seeds, perfect to balance the sweet bar.', 'Ropogós sós rudak vajjal, érlelt sajttal és köménnyel vagy mákkal, tökéletesen kiegyensúlyozzák az édes candy bart.'),
      image: 'https://assets.boosteat.com/images/c165/2023-05-10/20230510120628212645b88c4558cb/image.jpeg'
    },
    {
      name: pick('Tort de Prezentare (kg)', 'Presentation Cake (kg)', 'Bemutató torta (kg)'),
      price: '150 RON',
      desc: pick('Tort personalizat cu etaje pentru ocazii speciale, îmbrăcat în cremă fină de brânză și decorat cu flori naturale sau fructe.', 'Custom multi-tiered cake for special occasions, coated in smooth cream cheese frosting and decorated with real flowers or fruits.', 'Egyedi emeletes torta különleges alkalmakra, sima krémsajtos bevonattal és valódi virágokkal vagy gyümölcsökkel díszítve.'),
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
    
    const calculatedMessage = language === 'hu'
      ? `Automatikusan számolt ajánlás:
- ${minicakesQty} Mini Cheesecake (vegyes ízek)
- ${jarsQty} Poharas Cheesecake (120g)
- ${macaronsQty} Prémium Macaron
- ${pavlovasQty} Mini Pavlova
${includeSaratle ? `- ${saratleQty} kg sós sajtos rúd\n` : ''}${includeCake ? `- ${cakeQty} kg bemutató torta\n` : ''}
Becsült költség: kb. ${totalCostEstimate} RON.`
      : language === 'en'
      ? `Automatically calculated recommendation:
- ${minicakesQty} Mini Cheesecakes (Mixed flavors)
- ${jarsQty} Cheesecake jars (120g)
- ${macaronsQty} Premium Macarons
- ${pavlovasQty} Mini Pavlova
${includeSaratle ? `- ${saratleQty} kg Savory cheese crackers\n` : ''}${includeCake ? `- Presentation cake: ${cakeQty} kg\n` : ''}
Estimated budget: approx. ${totalCostEstimate} RON.`
      : `Recomandare calculată automat:
- ${minicakesQty} Mini Cheesecakes (Aromă mixtă)
- ${jarsQty} Borcanele de Cheesecake (120g)
- ${macaronsQty} Macarons Premium
- ${pavlovasQty} Mini Pavlova
${includeSaratle ? `- ${saratleQty} kg Sărățele cu telemea\n` : ''}${includeCake ? `- Tort de prezentare de ${cakeQty} kg\n` : ''}
Buget estimat: aprox. ${totalCostEstimate} RON.`
      ;

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
      setSubmitError(pick('Vă rugăm să completați câmpurile obligatorii (*).', 'Please fill in the required fields (*).', 'Kérjük, töltsd ki a kötelező mezőket (*).'));
      return;
    }

    // Build a descriptive message including the selected services, theme and location.
    const selectedServices = Object.entries(formServices)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(', ');
    const composedMessage = [
      formMessage,
      formTheme ? `${pick('Tematică', 'Theme', 'Téma')}: ${formTheme}` : '',
      selectedServices ? `${pick('Servicii', 'Services', 'Szolgáltatások')}: ${selectedServices}` : '',
      formLocation ? `${pick('Locație', 'Location', 'Helyszín')}: ${formLocation}` : '',
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
      setSubmitError(pick('Nu am putut trimite solicitarea. Te rugăm să încerci din nou.', 'We could not send your request. Please try again.', 'Nem tudtuk elküldeni a kérésedet. Kérjük, próbáld újra.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="candybar-section">
      <div className="candybar-container">
        
        {/* Header */}
        <div className="candybar-header text-center">
          <span className="section-subtitle">{pick('Evenimente Memorabile', 'Unforgettable Events', 'Emlékezetes Események')}</span>
          <h1 className="candybar-main-title">Candy Bar &amp; Torturi</h1>
          <div className="gold-divider"></div>
          <p className="candybar-intro">
            {pick(
              'Petrecerea perfectă presupune un mix alcătuit din foarte multe elemente, unul dintre acestea fiind candy bar-ul. De aceea, vrem să transformăm fiecare petrecere într-o poveste plină de savoare și culoare. Vă oferim consultanță în alegerea produselor preferate, pentru a crea decorul dorit, îmbinat cu tematica petrecerii.',
              'The perfect party is a mix of many elements, and the candy bar is key. We want to transform every event into a story of flavor and color, providing full consulting to match your theme.',
              'A tökéletes esemény sok elemből áll, ezek közül az egyik legfontosabb a candy bar. Minden rendezvényt ízekkel és színekkel teli történetté szeretnénk alakítani, és segítünk a megfelelő termékek kiválasztásában.'
            )}
          </p>
        </div>

        {/* Brochure Slide Carousel */}
        <div className="brochure-carousel-wrapper">
          <h2 className="section-block-title">{pick('Catalogul Nostru Oficial (Broșură)', 'Our Official Catalog Brochure', 'Hivatalos katalógusunk')}</h2>
          <p className="section-block-desc">
            {pick('Răsfoiește paginile ofertei noastre pentru a vizualiza recomandările și decorurile noastre.', 'Flip through our catalog pages to see event decorations and setups.', 'Lapozd át ajánlatunk oldalait, és nézd meg dekorációs és tálalási ötleteinket.')}
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
              <h3>⚡ {pick('Calculator de Cantități & Buget', 'Quantity & Budget Calculator', 'Mennyiség- és költségkalkulátor')}</h3>
              <p className="calc-note">
                {pick('Alege numărul de invitați pentru a calcula instant sortimentele ideale și costul estimativ:', 'Select your guest count to instantly calculate recommended items and estimated cost:', 'Válaszd ki a vendégek számát, és azonnal kiszámoljuk az ajánlott mennyiségeket és a becsült költséget:')}
              </p>
              
              <div className="control-group">
                <label className="slider-label">
                  <span>👤 {pick('Număr Invitați:', 'Number of Guests:', 'Vendégek száma:')} <strong>{guestCount}</strong></span>
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
                  <span>🎂 {pick('Include Tort de Prezentare (100g / invitat)', 'Include Presentation Cake (100g / guest)', 'Tartalmazzon bemutató tortát (100g / vendég)')}</span>
                </label>
                
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={includeSaratle} 
                    onChange={(e) => setIncludeSaratle(e.target.checked)} 
                  />
                  <span>🥨 {pick('Include Sărățele cu Telemea (15g / invitat)', 'Include Savory Cheese Crackers (15g / guest)', 'Tartalmazzon sós sajtos rudakat (15g / vendég)')}</span>
                </label>
              </div>

              <button className="apply-calc-btn" onClick={applyCalculatorToForm}>
                📋 {pick('Aplică recomandarea în Formular', 'Apply recommendation to Quote Form', 'Ajánlás átvitele az űrlapba')}
              </button>
            </div>

            <div className="calculator-results">
              <h4>📋 {pick('Configurație Recomandată', 'Recommended Configuration', 'Ajánlott összeállítás')}</h4>
              <div className="results-list">
                <div className="result-item">
                  <span className="item-qty">{minicakesQty}x</span>
                  <span className="item-name">Mini Cheesecakes ({pick('diverse arome', 'mixed flavors', 'vegyes ízek')})</span>
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
                    <span className="item-name">{pick('Sărățele cu telemea', 'Cheese crackers', 'Sós sajtos rudak')}</span>
                    <span className="item-cost">{saratleCost} RON</span>
                  </div>
                )}
                {includeCake && (
                  <div className="result-item highlight">
                    <span className="item-qty">{cakeQty} kg</span>
                    <span className="item-name">{pick('Tort etajat de prezentare', 'Presentation tiered cake', 'Bemutató emeletes torta')}</span>
                    <span className="item-cost">{cakeCost} RON</span>
                  </div>
                )}
              </div>
              
              <div className="results-total">
                <span className="total-label">{pick('Buget Estimativ:', 'Estimated Cost:', 'Becsült költség:')}</span>
                <span className="total-price">{totalCostEstimate} RON</span>
              </div>
              <span className="calc-disclosure">
                * {pick('Prețul final poate varia în funcție de personalizări, decoruri și transport.', 'Final cost may vary based on customization, decorations, and transport.', 'A végső ár a személyre szabás, dekoráció és szállítás függvényében változhat.')}
              </span>
            </div>
          </div>
        </div>

        {/* A-La-Carte Catalog Grid */}
        <div className="candy-catalog-wrapper">
          <h2 className="section-block-title">{pick('Meniu A-La-Carte & Prețuri', 'A-La-Carte Menu & Prices', 'A la carte menü és árak')}</h2>
          <p className="section-block-desc">
            {pick('Sortimentele noastre premium care pot fi configurate liber în compoziția candy bar-ului tău.', 'Our premium sweets that can be customized freely for your special candy bar.', 'Prémium desszertjeink, amelyek szabadon összeállíthatók a saját candy barodhoz.')}
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
            <h3>✉️ {pick('Solicită o Ofertă Personalizată', 'Request a Personalized Quote', 'Kérj személyre szabott ajánlatot')}</h3>
            <p>
              {pick('Trimite-ne un mesaj cu detaliile evenimentului tău, iar noi îți răspundem în cel mai scurt timp cu o ofertă dedicată.', 'Send us details about your event, and we will get back to you with a tailored offer.', 'Küldd el nekünk az eseményed részleteit, és hamarosan személyre szabott ajánlattal jelentkezünk.')}
            </p>
            
            {formSuccess ? (
              <div className="form-success-container animate-fade-in">
                <span className="success-icon">🎉</span>
                <h4>{pick('Solicitare Trimisă cu Succes!', 'Quote Request Sent Successfully!', 'Az ajánlatkérés sikeresen elküldve!')}</h4>
                <p>
                  {pick('Îți mulțumim pentru interes! Un consultant The Cheesecake House te va contacta telefonic sau prin e-mail în maxim 24 de ore.', 'Thank you! A Cheesecake House event specialist will contact you via phone or email within 24 hours.', 'Köszönjük az érdeklődést! A The Cheesecake House egyik tanácsadója 24 órán belül telefonon vagy emailben felveszi veled a kapcsolatot.')}
                </p>
                <button className="reset-btn" onClick={() => setFormSuccess(false)}>
                  {pick('Trimite o altă solicitare', 'Send another request', 'Küldj másik kérést')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>{pick('Nume Contact *', 'Contact Name *', 'Kapcsolattartó neve *')}</label>
                    <input 
                      type="text" 
                      required 
                      placeholder={pick('Ex: Maria Ionescu', 'e.g. John Doe', 'pl. Kiss Anna')}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{pick('Număr Contact *', 'Contact Phone *', 'Kapcsolati telefonszám *')}</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder={pick('Ex: 07xx xxx xxx', 'e.g. 07xx xxx xxx', 'pl. 07xx xxx xxx')}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder={pick('Ex: maria@example.com', 'e.g. maria@example.com', 'pl. anna@example.com')}
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{pick('Data Evenimentului *', 'Event Date *', 'Esemény dátuma *')}</label>
                    <input 
                      type="date" 
                      required 
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{pick('Locația Evenimentului *', 'Event Location *', 'Esemény helyszíne *')}</label>
                    <select value={formLocation} onChange={(e) => setFormLocation(e.target.value)}>
                      <option value="Cluj-Napoca">Cluj-Napoca</option>
                      <option value="Târgu Mureș">Târgu Mureș</option>
                      <option value="Bistrița">Bistrița</option>
                      <option value="Alta">{pick('Alta (În afara acestor orașe)', 'Other (outside these cities)', 'Más helyszín (ezeken a városokon kívül)')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{pick('Număr Invitați', 'Guest Count', 'Vendégek száma')}</label>
                    <input 
                      type="number" 
                      placeholder={pick('Ex: 100', 'e.g. 100', 'pl. 100')}
                      value={formGuestsInput}
                      onChange={(e) => setFormGuestsInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group options-group">
                  <label>{pick('Servicii Dorite', 'Requested Services', 'Kért szolgáltatások')}</label>
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
                      <span>{pick('Tort de prezentare', 'Presentation cake', 'Bemutató torta')}</span>
                    </label>
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={formServices.marturii} 
                        onChange={(e) => setFormServices({...formServices, marturii: e.target.checked})}
                      />
                      <span>{pick('Mărturii dulci', 'Sweet favors / testimonials', 'Édes ajándékok')}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>{pick('Tematica sau Schema Cromatica', 'Theme or Color Palette', 'Téma vagy színpaletta')}</label>
                  <input 
                    type="text" 
                    placeholder={pick('Ex: Boho-chic, Elegance Gold, Roșu regal', 'e.g. Vintage, Emerald green, Pastel pink', 'pl. Boho-chic, arany elegancia, királyi vörös')}
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{pick('Mesaj / Observații', 'Message / Special Notes', 'Üzenet / Megjegyzések')}</label>
                  <textarea 
                    rows="5" 
                    placeholder={pick('Aici puteți adăuga detalii speciale despre locație, preferințe pentru arome sau alergii.', 'Add notes regarding venue, flavor preferences or allergies here.', 'Itt adhatsz meg különleges helyszíni részleteket, ízpreferenciákat vagy allergiákat.')}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  ></textarea>
                </div>

                {submitError && (
                  <p className="form-error-text" style={{ color: '#c0392b' }}>{submitError}</p>
                )}

                <button type="submit" className="form-submit-btn" disabled={submitting}>
                  ✨ {submitting ? t('sendingGeneric') : pick('Trimite Solicitarea', 'Send Quote Request', 'Ajánlatkérés elküldése')}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
