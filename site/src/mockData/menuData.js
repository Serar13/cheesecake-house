export const categories = [
  { id: 'cake-collection', name: 'Cake Collection', icon: '🍰' },
  { id: 'san-sebastian', name: 'San Sebastian', icon: '🍮' },
  { id: 'classic-cheesecake', name: 'Classic Cheesecake', icon: '🧀' },
  { id: 'cheesecake-jar', name: 'Cheesecake Jar', icon: '🫙' },
  { id: 'vegan-collection', name: 'Vegan Collection', icon: '🌱' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' }
];

export const products = [
  // Cake Collection
  {
    id: 'carrot-cake',
    categoryId: 'cake-collection',
    name: 'Carrot Cake',
    price: 24.00,
    unit: 'felie',
    weight: '125 g',
    image: '/images/carrot_cake.png',
    description: 'Un tort de morcovi pufos, aromat cu scorțișoară și completat de o cremă fină de brânză. Delicat, echilibrat și irezistibil.'
  },
  {
    id: 'medovic-fistic',
    categoryId: 'cake-collection',
    name: 'Medovic cu fistic și zmeură',
    price: 26.00,
    unit: 'felie',
    weight: '130 g',
    image: '/images/carrot_cake.png', // Using carrot cake as placeholder for other cakes or styling them nicely
    description: 'Foi fragede cu miere, cremă fină cu fistic și o inserție delicată de zmeură pentru un contrast ușor acrișor. Un desert rafinat, echilibrat și plin de savoare.'
  },
  {
    id: 'red-velvet',
    categoryId: 'cake-collection',
    name: 'Red Velvet cu Căpșuni',
    price: 24.00,
    unit: 'felie',
    weight: '135 g',
    image: '/images/red_velvet.png',
    description: 'Blat catifelat de Red velvet, fin și intens, îmbogățit cu o inserție fresh de căpșuni și cremă delicată de brânză. Dulce, ușor fructat și perfect echilibrat.'
  },
  // San Sebastian
  {
    id: 'san-sebastian-classic',
    categoryId: 'san-sebastian',
    name: 'San Sebastian Original',
    price: 25.00,
    unit: 'felie',
    weight: '150 g',
    image: '/images/san_sebastian.png',
    description: 'Slăvitul cheesecake basc cu interior cremos, aproape curgător, și o crustă caramelizată delicioasă. Un adevărat răsfăț culinar.'
  },
  {
    id: 'san-sebastian-ciocolata',
    categoryId: 'san-sebastian',
    name: 'San Sebastian cu sos de Ciocolată',
    price: 28.00,
    unit: 'felie',
    weight: '170 g',
    image: '/images/san_sebastian.png',
    description: 'San Sebastian Cheesecake original servit din abundență cu sos cald de ciocolată belgiană cu lapte sau neagră.'
  },
  // Classic
  {
    id: 'classic-strawberry',
    categoryId: 'classic-cheesecake',
    name: 'Classic New York cu Căpșuni',
    price: 22.00,
    unit: 'felie',
    weight: '140 g',
    image: '/images/red_velvet.png',
    description: 'Reteta clasica de New York Cheesecake, coaptă lent, cu o crustă crocantă de biscuiți și un jeleu acrișor de căpșuni proaspete.'
  },
  {
    id: 'classic-caramel',
    categoryId: 'classic-cheesecake',
    name: 'Classic cu Caramel Sărat',
    price: 22.00,
    unit: 'felie',
    weight: '140 g',
    image: '/images/carrot_cake.png',
    description: 'Cheesecake clasic fin, acoperit cu un strat generos de caramel sărat preparat în casă și alune de pădure crocante.'
  },
  // Jars
  {
    id: 'jar-raspberry',
    categoryId: 'cheesecake-jar',
    name: 'Raspberry Cheesecake Jar',
    price: 20.00,
    unit: 'pahar',
    weight: '150 g',
    image: '/images/cheesecake_jar.png',
    description: 'Cheesecake la pahar (borcănaș) cu biscuiți digestivi untoși, cremă fină de brânză și piure proaspăt de zmeură aromatică.'
  },
  {
    id: 'jar-oreo',
    categoryId: 'cheesecake-jar',
    name: 'Oreo & Caramel Jar',
    price: 20.00,
    unit: 'pahar',
    weight: '150 g',
    image: '/images/cheesecake_jar.png',
    description: 'Desert la borcănaș cu straturi fine de cremă de brânză, biscuiți Oreo mărunțiți și inserție de sos intens de caramel.'
  },
  // Vegan
  {
    id: 'vegan-berry',
    categoryId: 'vegan-collection',
    name: 'Vegan Raw Cherry & Almond',
    price: 26.00,
    unit: 'felie',
    weight: '120 g',
    image: '/images/cheesecake_jar.png',
    description: 'Cheesecake vegan preparat la rece din caju cremos, ulei de cocos pur, curmale și migdale crocante, topped cu cireșe zemoase.'
  },
  // Drinks
  {
    id: 'drink-espresso',
    categoryId: 'drinks',
    name: 'Espresso Single',
    price: 9.00,
    unit: 'buc',
    weight: '30 ml',
    image: '/images/san_sebastian.png',
    description: 'Cafea espresso preparată din boabe de specialitate proaspăt prăjite, cu note intense de ciocolată și alune.'
  },
  {
    id: 'drink-lemonade',
    categoryId: 'drinks',
    name: 'Limonadă Clasică',
    price: 15.00,
    unit: 'buc',
    weight: '400 ml',
    image: '/images/cheesecake_jar.png',
    description: 'Băutură răcoritoare preparată din lămâi stoarse, miere de albine locală și mentă proaspătă.'
  }
];

export const stores = [
  {
    id: 'tg-mures',
    name: 'The Cheesecake House Tg. Mureș',
    phone: '+40 757 823 828',
    email: 'comenzi@thecheesecakehouse.ro',
    address: 'Strada Nicolae Iorga 14, Târgu Mureș, Romania',
    schedule: 'Luni - Duminică: 10:00 - 19:30',
    coordinates: { lat: 46.5481, lng: 24.5686 }
  },
  {
    id: 'cluj-napoca',
    name: 'The Cheesecake House Cluj-Napoca',
    phone: '+40 740 017 179',
    email: 'contact@thecheesecakehouse.ro',
    address: 'Strada Samuil Micu 7, Cluj-Napoca, Romania',
    schedule: 'Luni - Duminică: 10:00 - 21:00',
    coordinates: { lat: 46.7684, lng: 23.5866 }
  },
  {
    id: 'bistrita',
    name: 'The Cheesecake House Bistrița',
    phone: '+40 753 066 444',
    email: 'contact@thecheesecakehouse.ro',
    address: 'Piața Mică 19, Bistrița, România',
    schedule: 'Luni - Duminică: 10:00 - 20:00',
    coordinates: { lat: 47.1320, lng: 24.4976 }
  }
];

export const reviews = [
  {
    id: 1,
    name: 'Andrei Popescu',
    rating: 5,
    text: 'Cea mai bună prăjitură San Sebastian din România! Sosul de ciocolată este absolut divin, iar personalul este deosebit de amabil.',
    date: 'Acum 2 zile'
  },
  {
    id: 2,
    name: 'Maria Szabo',
    rating: 5,
    text: 'Carrot Cake-ul este extrem de pufos și aromat, cu o cremă de brânză perfect echilibrată, nu foarte dulce. Recomand cu drag locația din Cluj!',
    date: 'Acum o săptămână'
  },
  {
    id: 3,
    name: 'Ioan Mureșan',
    rating: 5,
    text: 'Am comandat un cheesecake întreg pentru aniversarea soției. A fost gata exact la timp, arăta impecabil și gustul a fost de neegalat.',
    date: 'Acum 2 săptămâni'
  }
];
