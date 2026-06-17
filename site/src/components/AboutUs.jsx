import React from 'react';
import { useApp } from '../context/AppContext';
import './AboutUs.css';

export default function AboutUs() {
  const { t, language } = useApp();

  const isRo = language === 'ro';

  const timelineItems = [
    {
      year: 'Martie 2017',
      title: isRo ? 'Ideea primei felii 🍰' : 'The First Slice Idea 🍰',
      desc: isRo 
        ? 'Totul a pornit de la gustul consacrat de cheesecake american, bazat pe cremă de brânză, lucru care pe atunci nu era de găsit prin țară. Prima rețetă a fost împrumutată de pe Pinterest și perfecționată în bucătăria de acasă timp de 6 luni.'
        : 'It all started from the established taste of American cream cheese-based cheesecake, which was hard to find in the country back then. The first recipe was borrowed from Pinterest and perfected in the home kitchen over 6 months.',
      image: 'https://assets.boosteat.com/images/c165/2024-07-09/20240709100413212668d0b1d9a9d5/image.png'
    },
    {
      year: 'Octombrie 2017',
      title: isRo ? 'Primul punct de lucru 🏪' : 'First Physical Location 🏪',
      desc: isRo
        ? 'Am deschis porțile primului nostru punct de lucru oficial în Târgu Mureș, transformând pasiunea de acasă într-un brand iubit pe plan local.'
        : 'We opened the doors of our first official physical location in Târgu Mureș, transforming home passion into a locally beloved brand.',
      image: 'https://assets.boosteat.com/images/c165/2024-04-11/202404111109122126617c4d828492/image.jpg'
    },
    {
      year: 'Octombrie 2020',
      title: isRo ? 'Furnizori ai Casei Regale 👑' : 'Royal House Suppliers 👑',
      desc: isRo
        ? 'După un proces riguros de evaluare început în 2019, am primit titlul de Furnizori Oficiali ai Casei Regale a României, decernat chiar de către Majestatea Sa Margareta, Custodele Coroanei române. Suntem singurul furnizor oficial pe partea de cofetărie.'
        : 'After a rigorous evaluation process starting in 2019, we were granted the title of Official Suppliers of the Royal House of Romania, awarded directly by Her Majesty Margareta, Custodian of the Romanian Crown. We are the sole official confectionery supplier.',
      image: 'https://assets.boosteat.com/images/c165/2024-04-11/202404111109042126617c4d0cc3ad/image.jpg'
    },
    {
      year: '2021',
      title: isRo ? 'Standardizare & Francizare 📋' : 'Standardization & Franchising 📋',
      desc: isRo
        ? 'Am început colaborarea cu Frenchwise pentru a dezvolta manualele de francizare. Acest parteneriat ne-a eficientizat procesele administrative, de producție în cofetării și în laborator.'
        : 'We started working with Frenchwise to develop franchise manuals. This partnership streamlined our administrative, production, and laboratory workflows.',
      image: 'https://assets.boosteat.com/images/c165/2024-07-09/20240709100154212668d0a92d7f80/image.png'
    },
    {
      year: '2022',
      title: isRo ? 'Renovare & Rebranding 🎨' : 'Renovation & Rebranding 🎨',
      desc: isRo
        ? 'Am realizat un proces complet de rebranding și am renovat în totalitate cofetăria din Târgu Mureș pentru a o alinia la viziunea modernă și elegantă a brandului.'
        : 'We executed a complete rebranding process and fully renovated the bakery in Târgu Mureș to align it with our modern and elegant brand vision.',
      image: 'https://assets.boosteat.com/images/c165/2024-04-11/202404111109182126617c4dec3a46/image.jpg'
    },
    {
      year: '2023',
      title: isRo ? 'Expansiune în Cluj-Napoca 🚀' : 'Expansion in Cluj-Napoca 🚀',
      desc: isRo
        ? 'Am investit peste 200.000€ în deschiderea cofetăriei din Cluj-Napoca și peste 300.000€ în modernizarea laboratorului nostru. Tot la finele anului 2023, Majestatea Sa ne-a consemnat prelungirea titlului de Furnizori Oficiali cu încă 3 ani.'
        : 'We invested over €200,000 in opening the Cluj-Napoca shop and over €300,000 in upgrading our laboratory. Additionally, Her Majesty extended our Royal Supplier title for another 3 years.',
      image: 'https://assets.boosteat.com/images/c211/2024-04-11/202404111148323266617ce109cf5f/image.jpg'
    },
    {
      year: '2024',
      title: isRo ? 'Noua Cofetărie din Bistrița 📍' : 'New Shop in Bistrița 📍',
      desc: isRo
        ? 'Am deschis o nouă locație fermecătoare în inima Bistriței, pe Piața Mică nr. 19, aducând deliciile noastre premiate mai aproape de iubitorii de dulce din județ.'
        : 'We opened a charming new location in the heart of Bistrița, at Piața Mică 19, bringing our award-winning treats closer to local dessert lovers.',
      image: 'https://assets.boosteat.com/images/c165/2024-04-11/202404111120092126617c769f16c4/image.jpg'
    },
    {
      year: 'Prezent',
      title: isRo ? 'Laboratorul Nostru Premium 🧑‍🍳' : 'Our Premium Laboratory 🧑‍🍳',
      desc: isRo
        ? 'Astăzi operăm un laborator modern de 200 mp unde lucrează 10 angajați calificați, cu o capacitate de producție certificată DSV de 200 de cheesecake-uri/zi. Deservim 3 locații proprii și peste 15 restaurante partenere de renume.'
        : 'Today we operate a modern 200 sqm laboratory with 10 skilled staff members and a DSV-certified capacity of 200 cheesecakes per day, serving our 3 shops and over 15 partner restaurants.',
      image: 'https://assets.boosteat.com/images/c165/2024-07-09/20240709102004212668d0ed471f47/image.png'
    }
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        
        {/* Calligraphy Intro Section */}
        <div className="about-intro-hero">
          <span className="section-subtitle">{t('aboutSubtitle')}</span>
          <h1 className="about-main-title">{isRo ? 'Despre Noi' : 'About Us'}</h1>
          <div className="gold-divider"></div>
          
          <div className="about-quote-container">
            <p className="about-quote-text">
              „Din căutarea simplităţii, a bucuriei, a micilor plăceri &amp; a unui simplu moment a luat naștere dintr-o pasiune ”felia” care avea să ajungă un statement a perseverenţei și seriozităţii cu care ne tratăm produsele.”
            </p>
            <span className="about-quote-motto">Find joy in the simple.</span>
          </div>
        </div>

        {/* Narrative Grid */}
        <div className="about-narrative-grid">
          <div className="about-narrative-card">
            <h3>{isRo ? 'Misiunea Noastră' : 'Our Mission'}</h3>
            <p>
              {isRo 
                ? 'Misiunea noastră este să propunem diversitate în simplitate prin varietatea de arome, texturi și gusturi cu care se identifică cheesecake-ul. Ne dorim ca The Cheesecake House să ofere tuturor dorința de aprofundare a bucuriei prin lucruri simple, aparent mărunte, însă cu potențial mare de transformare.'
                : 'Our mission is to offer diversity in simplicity through the variety of flavors, textures, and tastes that identify our cheesecake. We want The Cheesecake House to inspire everyone to find joy in simple things.'}
            </p>
            <p>
              {isRo
                ? 'Pregătim totul cu atenție până la ultimul element dulce pus pe cheesecake, dar ceea ce oferă desertului aura specială este tehnica și ingredientele folosite. Folosim ce e mai bun de la natură și alegem de fiecare dată ingrediente naturale, pe care le mixăm cu grijă și le coacem la temperatura potrivită.'
                : 'We carefully prepare everything down to the last sweet element, but what gives the dessert its special aura is the technique and ingredients. We use nature\'s best, choosing natural ingredients mixed with care and baked perfectly.'}
            </p>
          </div>
          
          <div className="about-narrative-card">
            <h3>{isRo ? 'Vitrina Noastră' : 'Our Showcase'}</h3>
            <p>
              {isRo
                ? 'În vitrinele noastre sunt mereu 12 sortimente proaspete de cheesecake, pe lângă Pavlove delicate, Cookies mari și Bread-uri făcute în casă. Toate produsele noastre sunt create ținând cont de sezonalitate, respectând natura și menținând prețuri decente pentru a minimiza risipa.'
                : 'In our display cases there are always 12 fresh varieties of cheesecake, alongside delicate Pavlovas, large Cookies, and home-baked Bread. All our treats are made with seasonality in mind, respecting nature and minimizing waste.'}
            </p>
            <div className="showcase-highlights">
              <div className="highlight-item">
                <strong>Joy Of The Month</strong>
                <span>{isRo ? 'Un sortiment inedit, creat special în fiecare lună.' : 'A unique variety, specially created every single month.'}</span>
              </div>
              <div className="highlight-item">
                <strong>Taste Of The Week</strong>
                <span>{isRo ? 'Arome iubite introduse săptămânal.' : 'Beloved flavors introduced on a weekly basis.'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="about-timeline-section">
          <h2 className="timeline-section-title text-center">{isRo ? 'Cronologia Reușitelor Noastre' : 'Our Achievements Timeline'}</h2>
          <p className="timeline-subtitle text-center">
            {isRo ? 'Parcursul nostru de la prima încercare acasă până la recunoașterea regală' : 'Our journey from the first recipe at home to official royal recognition'}
          </p>
          
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={index} className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
                  <div className="timeline-badge">{item.year}</div>
                  <div className="timeline-content">
                    {item.image && (
                      <div className="timeline-img-wrapper">
                        <img src={item.image} alt={item.title} className="timeline-img" loading="lazy" />
                      </div>
                    )}
                    <div className="timeline-text-wrapper">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seals Section */}
        <div className="about-achievements">
          <h3>{isRo ? 'Distincții & Certificări' : 'Distinctions & Certifications'}</h3>
          <p className="achievements-intro text-center">
            {isRo 
              ? 'Suntem mândri de recunoașterea eforturilor noastre de a menține cele mai înalte standarde culinare din România.'
              : 'We are proud of the official recognition of our efforts to maintain the highest culinary standards in Romania.'}
          </p>
          <div className="achievements-seals-row">
            <div className="seal-card">
              <img 
                src="https://assets.boosteat.com/images/c165/2024-07-08/20240708103119212668bbff7af981/image.png" 
                alt="Furnizor al Casei Regale a României" 
                className="seal-img"
              />
              <div className="seal-info">
                <h4>{isRo ? 'Furnizor Oficial al Casei Regale' : 'Official Supplier of the Royal House'}</h4>
                <p>{isRo 
                  ? 'Prelungit în 2023 pentru încă 3 ani. Suntem singurul furnizor pe partea de cofetărie al Casei Regale a României.' 
                  : 'Renewed in 2023 for 3 more years. We are the sole official confectionery provider of the Romanian Royal Family.'}</p>
              </div>
            </div>

            <div className="seal-card">
              <img 
                src="https://assets.boosteat.com/images/c165/2024-07-08/20240708103123212668bbffb2ba85/image.png" 
                alt="Best Takeaway Food 2023 - Restaurant Guru" 
                className="seal-img"
              />
              <div className="seal-info">
                <h4>Best Takeaway Food</h4>
                <p>{isRo 
                  ? 'Premiu oferit de Restaurant Guru în 2023, reflectând recenziile și aprecierile excelente ale clienților noștri.' 
                  : 'Awarded by Restaurant Guru in 2023, reflecting the excellent reviews and ratings from our customers.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="about-stats-panel-row">
          <div className="stat-card-glow">
            <span className="stat-num">3</span>
            <span className="stat-label">{isRo ? 'Locații Fizice' : 'Physical Shops'}</span>
            <span className="stat-sub">Tg. Mureș, Cluj, Bistrița</span>
          </div>
          <div className="stat-card-glow">
            <span className="stat-num">200m²</span>
            <span className="stat-label">{isRo ? 'Laborator Premium' : 'Premium Lab'}</span>
            <span className="stat-sub">{isRo ? 'Tehnologie de vârf' : 'State-of-the-art tech'}</span>
          </div>
          <div className="stat-card-glow">
            <span className="stat-num">200+</span>
            <span className="stat-label">{isRo ? 'Cakes / Zi' : 'Cakes / Day'}</span>
            <span className="stat-sub">{isRo ? 'Capacitate DSV' : 'DSV-certified capacity'}</span>
          </div>
          <div className="stat-card-glow">
            <span className="stat-num">15+</span>
            <span className="stat-label">{isRo ? 'Restaurante Partenere' : 'Restaurant Partners'}</span>
            <span className="stat-sub">{isRo ? 'În Transilvania' : 'Across Transylvania'}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
