import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const LOCAL_TRANSLATIONS = {
  ro: {
    storyTitle: "Povestea Noastră",
    statsTitle: "The Cheesecake House în Cifre",
    valuesTitle: "Valorile Noastre",
    connectWithUs: "Urmărește-ne online",
    royalSupplier: "👑 FURNIZOR OFICIAL AL CASEI REGALE",
    royalDesc: "Furnizor Oficial de cofetărie al Casei Regale a României, titlu acordat de Majestatea Sa Margareta, Custodele Coroanei.",
    
    // Stats
    statCakes: "Sortimente",
    statLocations: "Locații",
    statYears: "Ani de Pasiune",
    
    // Timeline
    t1Title: "2017 - Inspirația din SUA",
    t1Desc: "După o călătorie peste ocean, fondatorii Vlad, Sabina și Anca s-au îndrăgostit de cheesecake-ul american. Au urmat 6 luni de experimente intense în bucătăria de acasă pentru perfecționarea rețetei.",
    t2Title: "2018-2019 - Primul Laborator",
    t2Desc: "Am început în Târgu Mureș ca un laborator mic ce livra prăjituri către restaurante partenere. Succesul rapid ne-a motivat să deschidem prima cofetărie proprie în 2019.",
    t3Title: "2020 - Recunoașterea Regală",
    t3Desc: "Calitatea excepțională ne-a adus onoarea de a deveni Furnizor Oficial al Casei Regale a României, titlu oferit de MS Majestatea Sa Margareta, Custodele Coroanei.",
    t4Title: "2023 - Extinderea în Cluj",
    t4Desc: "Am deschis o nouă locație premium în inima Clujului, pe str. Samuil Micu nr. 7, aducând bucuria deserturilor noastre într-un spațiu cald și elegant.",

    // Values
    v1Title: "Simplitate",
    v1Desc: "Motto-ul nostru este 'Find joy in the simple!'. Credem în simplitatea gustului pur din cremă de brânză fină.",
    v2Title: "Calitate Regală",
    v2Desc: "Folosim exclusiv ingrediente premium și coacem manual în propriul laborator, respectând cele mai înalte standarde.",
    v3Title: "Comunitate",
    v3Desc: "Fiecare cofetărie este gândită ca un refugiu cald unde te poți bucura de clipe dulci alături de cei dragi."
  },
  en: {
    storyTitle: "Our Story",
    statsTitle: "The Cheesecake House in Numbers",
    valuesTitle: "Our Values",
    connectWithUs: "Connect with Us Online",
    royalSupplier: "👑 OFFICIAL SUPPLIER OF THE ROYAL HOUSE",
    royalDesc: "Official Confectionery Supplier of the Royal House of Romania, a title awarded by Her Majesty Margareta, Custodian of the Crown.",
    
    // Stats
    statCakes: "Flavors",
    statLocations: "Locations",
    statYears: "Years of Passion",
    
    // Timeline
    t1Title: "2017 - The USA Inspiration",
    t1Desc: "After a trip across the ocean, founders Vlad, Sabina, and Anca fell in love with authentic cheesecake. Six months of home kitchen experiments followed to craft the perfect recipe.",
    t2Title: "2018-2019 - First Laboratory",
    t2Desc: "We started in Târgu Mureș as a small laboratory supplying local restaurants. The immediate success motivated us to open our very first cozy retail shop in 2019.",
    t3Title: "2020 - Royal Supplier Status",
    t3Desc: "Our commitment to premium quality earned us the title of Official Confectionery Supplier of the Royal House of Romania, awarded by Her Majesty Margareta.",
    t4Title: "2023 - Launching in Cluj",
    t4Desc: "We expanded to Cluj-Napoca, opening a gorgeous premium shop on Samuil Micu St. no. 7, welcoming cake lovers into a warm and elegant setting.",

    // Values
    v1Title: "Simplicity",
    v1Desc: "Our motto is 'Find joy in the simple!'. We believe in the simple beauty of fine, pure cream cheese flavors.",
    v2Title: "Royal Quality",
    v2Desc: "We use only premium ingredients and bake from scratch in our own lab, maintaining the highest culinary standards.",
    v3Title: "Community",
    v3Desc: "Our shops are designed as warm spaces where you can share sweet, memorable moments with friends and family."
  },
  hu: {
    storyTitle: "Történetünk",
    statsTitle: "A The Cheesecake House számokban",
    valuesTitle: "Értékeink",
    connectWithUs: "Kövess minket online",
    royalSupplier: "👑 A KIRÁLYI HÁZ HIVATALOS BESZÁLLÍTÓJA",
    royalDesc: "A Román Királyi Ház hivatalos cukrászati beszállítója, Margit Őfelsége, a román korona őre által adományozott cím.",
    
    // Stats
    statCakes: "Sajttorták",
    statLocations: "Helyszínek",
    statYears: "Szenvedély Évei",
    
    // Timeline
    t1Title: "2017 - Amerikai Inspiráció",
    t1Desc: "Egy tengerentúli utazás után a két alapító, Vlad, Sabina és Anca beleszerettek az amerikai sajttortába. Ezt 6 hónap intenzív otthoni kísérletezés követte a tökéletes receptért.",
    t2Title: "2018-2019 - Az Első Laboratórium",
    t2Desc: "Kis laboratóriumként kezdtük Marosvásárhelyen, beszállítva a helyi éttermeknek. A gyors siker arra ösztönzött minket, hogy 2019-ben megnyissuk első saját cukrászdánkat.",
    t3Title: "2020 - Királyi Elismerés",
    t3Desc: "A kivételes minőség elnyerte a Román Királyi Ház hivatalos cukrászati beszállítói címét, amelyet Margit Őfelsége, a korona őre adományozott.",
    t4Title: "2023 - Terjeszkedés Kolozsváron",
    t4Desc: "Megnyitottuk új prémium cukrászdánkat Kolozsvár szívében, a Samuil Micu utca 7. szám alatt, meleg és elegáns környezetet biztosítva a sajttorta kedvelőinek.",

    // Values
    v1Title: "Egyszerűség",
    v1Desc: "Mottónk: 'Find joy in the simple!'. Hiszünk a krémsajt tiszta, egyszerű és finom ízében.",
    v2Title: "Királyi Minőség",
    v2Desc: "Kizárólag prémium alapanyagokat használunk, és kézzel sütünk saját laborunkban, a legmagasabb minőségben.",
    v3Title: "Közösség",
    v3Desc: "Cukrászdáinkat meleg, barátságos menedékként alakítottuk ki, ahol édes pillanatokat oszthat meg szeretteivel."
  }
};

export default function AboutScreen() {
  const { colors, language } = useApp();
  const styles = getStyles(colors);

  const loc = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS['ro'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Brand Hero Header */}
      <View style={styles.heroCard}>
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={32} color={colors.gold} />
        </View>
        <Text style={styles.brandTitle}>The Cheesecake House</Text>
        <Text style={styles.brandMotto}>Find joy in the simple</Text>
        
        {/* Royal Badge Section */}
        <View style={styles.royalBadge}>
          <Text style={styles.royalBadgeTitle}>{loc.royalSupplier}</Text>
          <Text style={styles.royalBadgeDesc}>{loc.royalDesc}</Text>
        </View>
      </View>

      {/* Social Media Section */}
      <View style={styles.socialsRow}>
        <TouchableOpacity 
          style={[styles.socialCard, { borderColor: '#e1306c' }]} 
          onPress={() => Linking.openURL('https://www.instagram.com/thecheesecakehouse.ro')}
        >
          <Ionicons name="logo-instagram" size={20} color="#e1306c" />
          <Text style={styles.socialLabel}>Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.socialCard, { borderColor: '#1877f2' }]} 
          onPress={() => Linking.openURL('https://www.facebook.com/TheCheesecakeHouse')}
        >
          <Ionicons name="logo-facebook" size={20} color="#1877f2" />
          <Text style={styles.socialLabel}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.socialCard, { borderColor: '#00f2fe' }]} 
          onPress={() => Linking.openURL('https://www.tiktok.com/@thecheesecakehous5')}
        >
          <Ionicons name="logo-tiktok" size={20} color={colors.text} />
          <Text style={styles.socialLabel}>TikTok</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.socialCard, { borderColor: colors.gold }]} 
          onPress={() => Linking.openURL('https://thecheesecake.ro')}
        >
          <Ionicons name="globe-outline" size={20} color={colors.gold} />
          <Text style={styles.socialLabel}>Website</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <Text style={styles.sectionTitle}>{loc.statsTitle}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>60+</Text>
          <Text style={styles.statLabel}>{loc.statCakes}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>{loc.statLocations}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7+</Text>
          <Text style={styles.statLabel}>{loc.statYears}</Text>
        </View>
      </View>

      {/* Timeline Story Section */}
      <Text style={styles.sectionTitle}>{loc.storyTitle}</Text>
      <View style={styles.timelineCard}>
        {/* Timeline Item 1 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDotActive} />
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.timelineRight}>
            <Text style={styles.timelineYear}>{loc.t1Title}</Text>
            <Text style={styles.timelineText}>{loc.t1Desc}</Text>
          </View>
        </View>

        {/* Timeline Item 2 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDotActive} />
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.timelineRight}>
            <Text style={styles.timelineYear}>{loc.t2Title}</Text>
            <Text style={styles.timelineText}>{loc.t2Desc}</Text>
          </View>
        </View>

        {/* Timeline Item 3 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDotActive} />
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.timelineRight}>
            <Text style={styles.timelineYear}>{loc.t3Title}</Text>
            <Text style={styles.timelineText}>{loc.t3Desc}</Text>
          </View>
        </View>

        {/* Timeline Item 4 */}
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDotActive} />
          </View>
          <View style={styles.timelineRight}>
            <Text style={styles.timelineYear}>{loc.t4Title}</Text>
            <Text style={styles.timelineText}>{loc.t4Desc}</Text>
          </View>
        </View>
      </View>

      {/* Values Section */}
      <Text style={styles.sectionTitle}>{loc.valuesTitle}</Text>
      <View style={styles.valuesContainer}>
        {/* Value 1 */}
        <View style={styles.valueCard}>
          <View style={styles.valueIconContainer}>
            <Ionicons name="sparkles" size={20} color={colors.gold} />
          </View>
          <Text style={styles.valueTitle}>{loc.v1Title}</Text>
          <Text style={styles.valueDesc}>{loc.v1Desc}</Text>
        </View>

        {/* Value 2 */}
        <View style={styles.valueCard}>
          <View style={styles.valueIconContainer}>
            <Ionicons name="ribbon" size={20} color={colors.gold} />
          </View>
          <Text style={styles.valueTitle}>{loc.v2Title}</Text>
          <Text style={styles.valueDesc}>{loc.v2Desc}</Text>
        </View>

        {/* Value 3 */}
        <View style={styles.valueCard}>
          <View style={styles.valueIconContainer}>
            <Ionicons name="people" size={20} color={colors.gold} />
          </View>
          <Text style={styles.valueTitle}>{loc.v3Title}</Text>
          <Text style={styles.valueDesc}>{loc.v3Desc}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  brandMotto: {
    fontSize: 11,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
  royalBadge: {
    backgroundColor: colors.goldMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  royalBadgeTitle: {
    fontSize: 11,
    color: colors.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  royalBadgeDesc: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 15,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '31%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gold,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },
  timelineCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  timelineDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.cardBg,
    marginTop: 4,
    zIndex: 5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 2,
    marginBottom: -4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineYear: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
    textAlign: 'justify',
  },
  valuesContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  valueCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'column',
  },
  valueIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  valueDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  socialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 20,
    width: '100%',
  },
  socialCard: {
    width: '23.5%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  socialLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  }
});
