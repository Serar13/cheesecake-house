import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function OffersScreen() {
  const { offers, colors, isLoggedIn, requestAuth: openAuth, t } = useApp();
  const styles = getStyles(colors);
  const [activeOffer, setActiveOffer] = useState(null);

  const requestAuth = () => {
    const reason = t('needAccountDesc');

    Alert.alert(
      t('needAccountTitle'),
      reason,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('connectOrRegister'),
          onPress: () => openAuth(reason)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Flash Offers Section */}
      <Text style={styles.sectionTitle}>Oferte Flash (Timp Limitat) ⚡</Text>
      
      {offers.filter(o => o.category === 'flash').map(offer => (
        <View key={offer.id} style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.flashBadge}>
                <Text style={styles.flashBadgeText}>Ofertă Flash</Text>
              </View>
              {offer.isNew && <View style={styles.newDot} />}
            </View>
            <Text style={styles.expiryText}>{offer.expiry}</Text>
          </View>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerDesc}>{offer.desc}</Text>
          
          <TouchableOpacity style={styles.activateBtn} onPress={() => (isLoggedIn ? setActiveOffer(offer) : requestAuth())}>
            <Ionicons name="barcode-outline" size={18} color="#12100e" style={{ marginRight: 6 }} />
            <Text style={styles.activateBtnText}>Afișează Cod de Reducere</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Secret Menu Section */}
      <Text style={styles.sectionTitle}>Meniu Secret deblocat 🤫</Text>
      
      {offers.filter(o => o.category === 'secret').map(offer => (
        <View key={offer.id} style={[styles.offerCard, styles.secretCard]}>
          <View style={styles.offerHeader}>
            <View style={styles.secretBadge}>
              <Text style={styles.secretBadgeText}>Exclusiv App</Text>
            </View>
          </View>
          <Text style={[styles.offerTitle, styles.secretTitle]}>{offer.title}</Text>
          <Text style={styles.offerDesc}>{offer.desc}</Text>
          
          <View style={styles.secretInfoRow}>
            <Ionicons name="sparkles" size={16} color={colors.gold} />
            <Text style={styles.secretInfoText}>
              Cum comanzi? Mergi în tab-ul **Meniu** și selectează categoria **Meniu Secret 🤫** din partea de sus!
            </Text>
          </View>
        </View>
      ))}

      {/* Inbox News Section */}
      <Text style={styles.sectionTitle}>Noutăți și Evenimente 📢</Text>
      
      <View style={styles.newsCard}>
        <Text style={styles.newsDate}>12 Iunie 2026</Text>
        <Text style={styles.newsTitle}>Degustare specială de cireșe în Cluj-Napoca 🍒</Text>
        <Text style={styles.newsDesc}>
          Te invităm vineri începând cu ora 18:00 la o degustare gratuită de rețete experimentale cu cireșe de sezon. Locuri limitate! Rezervă acum o masă din tab-ul Rezervări.
        </Text>
      </View>

      <View style={styles.newsCard}>
        <Text style={styles.newsDate}>08 Iunie 2026</Text>
        <Text style={styles.newsTitle}>Amenajare nouă la locația din Bistrița! 🌿</Text>
        <Text style={styles.newsDesc}>
          Am redecorat intrarea și terasa din Bistrița cu arcade florale noi! Te așteptăm să faci fotografii memorabile în timp ce te bucuri de cafeaua ta favorită.
        </Text>
      </View>

      {/* Barcode Modal Simulator */}
      <Modal visible={activeOffer !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.barcodeModalContainer}>
            <View style={styles.barcodeHeader}>
              <Text style={styles.barcodeTitle}>Cod Promoțional</Text>
              <TouchableOpacity onPress={() => setActiveOffer(null)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.offerDetailTitle}>{activeOffer?.title}</Text>
            <Text style={styles.barcodeModalDesc}>
              Prezintă acest cod la casa de marcat înainte de a plăti comanda pentru a aplica reducerea.
            </Text>

            {/* Simulated Barcode graphic */}
            <View style={styles.barcodeBox}>
              <View style={styles.barcodeLines}>
                {[2, 4, 1, 8, 3, 2, 6, 1, 4, 8, 2, 3, 5, 2, 7, 1, 3, 6, 2].map((width, idx) => (
                  <View 
                    key={idx} 
                    style={[
                      styles.barcodeLine, 
                      { width: width * 2, backgroundColor: idx % 2 === 0 ? '#12100e' : 'transparent' }
                    ]} 
                  />
                ))}
              </View>
              <Text style={styles.barcodeText}>* {activeOffer?.code || 'CHEESECAKE50'} *</Text>
            </View>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveOffer(null)}>
              <Text style={styles.closeModalBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12
  },
  offerCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  secretCard: {
    borderColor: colors.gold,
    borderWidth: 1.5
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flashBadge: {
    backgroundColor: '#e57373',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  flashBadgeText: {
    color: '#12100e',
    fontSize: 10,
    fontWeight: 'bold'
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#81c784',
    marginLeft: 8
  },
  secretBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  secretBadgeText: {
    color: '#12100e',
    fontSize: 10,
    fontWeight: 'bold'
  },
  expiryText: {
    color: '#e57373',
    fontSize: 11,
    fontWeight: '600'
  },
  offerTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6
  },
  secretTitle: {
    color: colors.gold
  },
  offerDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16
  },
  activateBtn: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  activateBtnText: {
    color: '#12100e',
    fontSize: 13,
    fontWeight: 'bold'
  },
  secretInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.inputBg,
    padding: 10,
    borderRadius: 8
  },
  secretInfoText: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  },
  newsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  newsDate: {
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 4
  },
  newsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  newsDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  barcodeModalContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  barcodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16
  },
  barcodeTitle: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: 'bold'
  },
  offerDetailTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  barcodeModalDesc: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24
  },
  barcodeBox: {
    backgroundColor: '#ffffff', // High contrast for scanning compatibility
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'stretch',
    marginBottom: 10
  },
  barcodeLine: {
    height: '100%'
  },
  barcodeText: {
    color: '#12100e',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: 'bold'
  },
  closeModalBtn: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold
  },
  closeModalBtnText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 14
  }
});
