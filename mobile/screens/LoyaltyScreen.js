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

export default function LoyaltyScreen() {
  const { stamps, maxStamps, vipPoints, addStamp, colors, isLoggedIn, requestAuth: openAuth, t } = useApp();
  const styles = getStyles(colors);
  const [qrVisible, setQrVisible] = useState(false);

  // Determine VIP Tier
  let vipTier = 'Bronze Member';
  let nextTierPoints = 250;
  let progress = vipPoints / nextTierPoints;
  let tierColor = '#cd7f32';

  if (vipPoints >= 500) {
    vipTier = 'Gold Ambassador';
    nextTierPoints = 1000;
    progress = (vipPoints - 500) / 500;
    tierColor = '#d4af37';
  } else if (vipPoints >= 200) {
    vipTier = 'Silver Connoisseur';
    nextTierPoints = 500;
    progress = (vipPoints - 200) / 300;
    tierColor = '#c0c0c0';
  }

  // Generate stamp grid items
  const renderStamps = () => {
    const stampItems = [];
    for (let i = 0; i < maxStamps; i++) {
      const isStamped = i < stamps;
      stampItems.push(
        <View key={i} style={[styles.stampSlot, isStamped && styles.stampSlotActive]}>
          {isStamped ? (
            <Ionicons name="pizza" size={28} color={colors.bg} />
          ) : (
            <Text style={styles.stampNumber}>{i + 1}</Text>
          )}
        </View>
      );
    }
    return stampItems;
  };

  const handleSimulateScan = () => {
    if (!isLoggedIn) {
      requestAuth();
      return;
    }

    addStamp(1);
    setQrVisible(false);
  };

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
      {/* Stamp Card Header */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Cheesecake Loyalty Card</Text>
          <Ionicons name="ribbon" size={24} color={colors.gold} />
        </View>
        <Text style={styles.cardSubtitle}>{t('stampNotice')}</Text>
        
        {/* Stamp Grid */}
        <View style={styles.stampGrid}>
          {renderStamps()}
        </View>

        <Text style={styles.stampsLeftText}>
          {maxStamps - stamps} {t('stampsLeftText')}
        </Text>
      </View>

      {/* QR Code trigger */}
      <TouchableOpacity style={styles.qrButton} onPress={() => (isLoggedIn ? setQrVisible(true) : requestAuth())}>
        <Ionicons name="qr-code-outline" size={22} color={colors.cardBg} />
        <Text style={styles.qrButtonText}>Scanează la Casă</Text>
      </TouchableOpacity>

      {/* VIP Tracker section */}
      <View style={styles.vipContainer}>
        <View style={styles.vipHeader}>
          <View>
            <Text style={styles.vipLabel}>Statut Club VIP</Text>
            <Text style={[styles.vipValue, { color: tierColor }]}>{vipTier}</Text>
          </View>
          <Text style={styles.vipPoints}>{vipPoints} {t('vipPointsLabel')}</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: tierColor }]} />
        </View>

        <Text style={styles.progressText}>
          {vipPoints < nextTierPoints 
            ? `Mai ai nevoie de ${nextTierPoints - vipPoints} puncte pentru următorul nivel.`
            : 'Felicitări! Ești la nivelul maxim.'}
        </Text>
      </View>


      {/* Rewards Description list */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Beneficii Niveluri VIP</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color="#cd7f32" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoHeadline}>Bronze Member (0 - 199 pct)</Text>
            <Text style={styles.infoBody}>Primești 15 puncte de fidelitate la fiecare felie achiziționată.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color="#c0c0c0" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoHeadline}>Silver Connoisseur (200 - 499 pct)</Text>
            <Text style={styles.infoBody}>Băutură din cafea gratuită la fiecare 3 vizite + acces la pre-comenzi.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color="#d4af37" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoHeadline}>Gold Ambassador (500+ pct)</Text>
            <Text style={styles.infoBody}>Invitații la degustări secrete + rezervări prioritare gratuite.</Text>
          </View>
        </View>
      </View>

      {/* QR Code Modal Simulator */}
      <Modal visible={qrVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContainer}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>Scanează Codul</Text>
              <TouchableOpacity onPress={() => setQrVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.qrModalDesc}>
              Apropie ecranul telefonului de scanerul de la casa de marcat din cofetărie pentru a acumula puncte.
            </Text>

            {/* Visual representation of a styled QR Code */}
            <View style={styles.qrBox}>
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrCornerBottomRight} />
              
              {/* Fake QR inner blocks */}
              <View style={styles.qrRow}>
                <View style={[styles.qrBlock, styles.qrBlockLarge]} />
                <View style={styles.qrBlock} />
                <View style={[styles.qrBlock, styles.qrBlockLarge]} />
              </View>
              <View style={styles.qrRow}>
                <View style={styles.qrBlock} />
                <View style={[styles.qrBlock, styles.qrBlockLarge]} />
                <View style={styles.qrBlock} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrBlock, styles.qrBlockLarge]} />
                <View style={styles.qrBlock} />
                <View style={styles.qrBlock} />
              </View>
            </View>

            {/* Test Action */}
            <TouchableOpacity style={styles.scanSimBtn} onPress={handleSimulateScan}>
              <Text style={styles.scanSimBtnText}>Simulează Scanarea (Testare)</Text>
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
  cardContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 20
  },
  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  stampSlot: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  stampSlotActive: {
    backgroundColor: colors.gold
  },
  stampNumber: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: 'bold'
  },
  stampsLeftText: {
    color: colors.text,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6
  },
  qrButton: {
    backgroundColor: colors.gold,
    flexDirection: 'row',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  qrButtonText: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  vipContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  vipLabel: {
    color: colors.textMuted,
    fontSize: 12
  },
  vipValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2
  },
  vipPoints: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: 'bold'
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 11
  },
  infoSection: {
    paddingHorizontal: 4
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start'
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 12
  },
  infoTextContainer: {
    flex: 1
  },
  infoHeadline: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  infoBody: {
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
  qrModalContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16
  },
  qrModalTitle: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: 'bold'
  },
  qrModalDesc: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#ffffff', // High contrast background for QR scanner compatibility
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#12100e'
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#12100e'
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#12100e'
  },
  qrCornerBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#12100e'
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  qrBlock: {
    width: 16,
    height: 16,
    backgroundColor: '#12100e',
    marginHorizontal: 4
  },
  qrBlockLarge: {
    width: 32,
    height: 32
  },
  scanSimBtn: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold
  },
  scanSimBtnText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 14
  }
});
