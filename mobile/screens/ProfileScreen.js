import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { 
    user, 
    updateProfile, 
    deleteAccount, 
    balance, 
    topUpWallet, 
    birthdayVoucherActive, 
    setBirthdayVoucherActive, 
    theme, 
    colors, 
    toggleTheme, 
    logout, 
    isLoggedIn,
    isGuest,
    setIsGuest,
    t 
  } = useApp();
  
  const styles = getStyles(colors);

  // Edit Profile modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // Gift Card form state
  const [recipient, setRecipient] = useState('');
  const [giftAmount, setGiftAmount] = useState('50');
  const [note, setNote] = useState('');

  const handleOpenEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(editName, editEmail, editPhone);
    if (success) {
      setEditModalVisible(false);
    }
  };

  const handleTopUp = (amount) => {
    topUpWallet(amount);
    Alert.alert(t('topUpSuccess'), `${t('topUpSuccess')}: +${amount} RON`);
  };

  const handleUseBirthdayVoucher = () => {
    if (!birthdayVoucherActive) return;

    Alert.alert(
      t('voucherScannedTitle'),
      t('voucherScannedDesc'),
      [
        {
          text: 'Ok',
          onPress: () => setBirthdayVoucherActive(false)
        }
      ]
    );
  };

  const handleSendGift = () => {
    if (!recipient.trim()) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return;
    }

    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t('error'), t('pleaseFillFields'));
      return;
    }

    if (balance < amount) {
      Alert.alert(t('insufficientFunds'), t('insufficientFunds'));
      return;
    }

    Alert.alert(
      t('giftSent'),
      `${t('giftSent')} ${amount} RON -> ${recipient}`,
      [{ 
        text: 'OK',
        onPress: () => {
          topUpWallet(-amount);
          setRecipient('');
          setNote('');
        }
      }]
    );
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'CH';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        
        {/* PROFILE HEADER CARD */}
        {!isLoggedIn ? (
          <View style={styles.profileCard}>
            <View style={styles.profileHeaderRow}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-outline" size={28} color={colors.gold} />
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.profileName}>{t('guestTitle')}</Text>
                <Text style={styles.profileSubText}>{t('guestSubtitle')}</Text>
              </View>
            </View>
            <View style={styles.profileActionsDivider} />
            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={() => setIsGuest(false)}
            >
              <Text style={styles.saveBtnText}>{t('connectOrRegister')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.profileHeaderRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.profileName}>{user?.name || 'Client'}</Text>
                <Text style={styles.profileSubText}>{user?.email || 'email@example.com'}</Text>
                <Text style={styles.profileSubText}>{user?.phone || '07xx xxx xxx'}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={handleOpenEdit}>
                <Ionicons name="create-outline" size={20} color={colors.gold} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileActionsDivider} />
            
            <View style={styles.profileCardFooter}>
              <TouchableOpacity style={styles.deleteAccBtn} onPress={deleteAccount}>
                <Ionicons name="trash-outline" size={16} color="#e57373" style={{ marginRight: 6 }} />
                <Text style={styles.deleteAccText}>{t('deleteAccount')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* GUEST MODE LOCKED SECTIONS VS REGULAR SECTIONS */}
        {!isLoggedIn ? (
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed-outline" size={48} color={colors.gold} style={{ marginBottom: 12 }} />
            <Text style={styles.lockedTitle}>{t('lockedFeatureTitle')}</Text>
            <Text style={styles.lockedDesc}>{t('lockedFeatureDesc')}</Text>
            <TouchableOpacity 
              style={[styles.saveBtn, { width: '100%', marginTop: 20 }]} 
              onPress={() => setIsGuest(false)}
            >
              <Text style={styles.saveBtnText}>{t('connectOrRegister')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* DIGITAL WALLET CARD */}
            <Text style={styles.sectionTitle}>{t('walletTitle')}</Text>
            <View style={styles.walletCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardBrand}>THE CHEESECAKE HOUSE</Text>
                <Text style={styles.cardLabel}>{t('digitalWalletCard')}</Text>
              </View>
              <View style={styles.cardBalanceContainer}>
                <Text style={styles.balanceText}>{balance.toFixed(2)} RON</Text>
                <Text style={styles.balanceLabel}>{t('walletBalance')}</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardNumber}>**** **** **** 1989</Text>
                <Ionicons name="wifi" size={20} color="#f6f2ee" />
              </View>
            </View>

            {/* TOP UP SECTION */}
            <Text style={styles.sectionTitle}>{t('topUpWallet')}</Text>
            <View style={styles.topUpRow}>
              {[50, 100, 200].map(amount => (
                <TouchableOpacity 
                  key={amount} 
                  style={styles.topUpBtn}
                  onPress={() => handleTopUp(amount)}
                >
                  <Text style={styles.topUpBtnText}>+{amount} RON</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* VOUCHERS SECTION */}
            <Text style={styles.sectionTitle}>{t('vouchersAndActiveGifts')}</Text>
            {birthdayVoucherActive ? (
              <TouchableOpacity style={styles.voucherCard} onPress={handleUseBirthdayVoucher}>
                <View style={styles.voucherLeft}>
                  <View style={styles.voucherIconBg}>
                    <Ionicons name="gift" size={24} color="#1b1713" />
                  </View>
                  <View style={styles.voucherInfo}>
                    <Text style={styles.voucherName}>{t('birthdayVoucherTitle')}</Text>
                    <Text style={styles.voucherDesc}>{t('birthdayVoucherDesc')}</Text>
                  </View>
                </View>
                <Text style={styles.voucherAction}>Scan</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyVouchers}>
                <Text style={styles.emptyText}>{t('emptyVouchers')}</Text>
              </View>
            )}

            {/* SEND GIFT CARD FORM */}
            <View style={styles.giftCardSection}>
              <Text style={styles.sectionTitleForm}>{t('sendGiftCard')}</Text>
              <Text style={styles.giftDesc}>{t('giftDescription')}</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('recipientName')}</Text>
                <TextInput 
                  style={styles.inputField} 
                  placeholder="Ex: Andrei Popescu"
                  placeholderTextColor={colors.textMuted}
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('giftAmount')}</Text>
                <View style={styles.amountToggleRow}>
                  {['30', '50', '100', '150'].map(val => (
                    <TouchableOpacity 
                      key={val}
                      style={[styles.amountToggle, giftAmount === val && styles.amountToggleActive]}
                      onPress={() => setGiftAmount(val)}
                    >
                      <Text style={[styles.amountToggleText, giftAmount === val && styles.amountToggleTextActive]}>
                        {val} RON
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('giftMessage')}</Text>
                <TextInput 
                  style={[styles.inputField, styles.textArea]} 
                  placeholder="La mulți ani! O felie din cheesecake-ul tău preferat!"
                  placeholderTextColor={colors.textMuted}
                  multiline={true}
                  numberOfLines={3}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              <TouchableOpacity style={styles.sendGiftBtn} onPress={handleSendGift}>
                <Ionicons name="paper-plane" size={18} color="#1b1713" style={{ marginRight: 8 }} />
                <Text style={styles.sendGiftBtnText}>{t('sendGiftButton')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* SETTINGS SECTION */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitleSettings}>{t('appSettings')}</Text>
          
          {/* Theme Toggle Switch Row */}
          <TouchableOpacity style={styles.settingsRow} onPress={toggleTheme}>
            <View style={styles.settingsLeft}>
              <Ionicons name={theme === 'dark' ? "moon" : "sunny-outline"} size={22} color={colors.gold} />
              <Text style={[styles.settingsText, { color: colors.text }]}>{t('themeMode')}</Text>
            </View>
            <View style={[styles.toggleContainer, theme === 'dark' && styles.toggleContainerActive, { borderColor: colors.border }]}>
              <View style={[styles.toggleCircle, theme === 'dark' && styles.toggleCircleActive, { backgroundColor: theme === 'dark' ? colors.gold : colors.textMuted }]} />
            </View>
          </TouchableOpacity>

          {/* Account Row */}
          <TouchableOpacity
            style={[styles.settingsRow, styles.logoutRow, { borderColor: colors.border }]}
            onPress={() => {
              if (isLoggedIn) {
                logout();
              } else {
                setIsGuest(false);
              }
            }}
          >
            <View style={styles.settingsLeft}>
              <Ionicons 
                name={isLoggedIn ? "log-out-outline" : "person-add-outline"} 
                size={22} 
                color={isLoggedIn ? "#e57373" : colors.gold} 
              />
              <Text style={[styles.settingsText, { color: isLoggedIn ? '#e57373' : colors.gold }]}>
                {isLoggedIn ? t('logout') : t('connectOrRegister')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={isLoggedIn ? "#e57373" : colors.gold} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('editProfile')}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.modalFormGroup}>
                <Text style={styles.modalInputLabel}>{t('fullName')}</Text>
                <TextInput 
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalInputLabel}>{t('email')}</Text>
                <TextInput 
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalInputLabel}>{t('phone')}</Text>
                <TextInput 
                  style={styles.modalInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>{t('saveChanges')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.bg
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40
  },
  profileCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.goldMuted,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gold
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 16
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2
  },
  profileSubText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1
  },
  editBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg
  },
  profileActionsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14
  },
  profileCardFooter: {
    alignItems: 'flex-start'
  },
  deleteAccBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  deleteAccText: {
    color: '#e57373',
    fontSize: 13,
    fontWeight: 'bold'
  },
  walletCard: {
    height: 170,
    backgroundColor: '#1b1713', // Keeps card dark/premium
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gold,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  cardInfo: {
    flexDirection: 'column'
  },
  cardBrand: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5
  },
  cardLabel: {
    color: '#aaa093',
    fontSize: 10,
    marginTop: 2
  },
  cardBalanceContainer: {
    alignItems: 'flex-start'
  },
  balanceText: {
    color: '#f6f2ee',
    fontSize: 28,
    fontWeight: 'bold'
  },
  balanceLabel: {
    color: '#aaa093',
    fontSize: 11
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardNumber: {
    color: '#aaa093',
    fontSize: 13,
    letterSpacing: 2
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8
  },
  sectionTitleForm: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  sectionTitleSettings: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  topUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  topUpBtn: {
    width: '31%',
    backgroundColor: colors.inputBg,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold
  },
  topUpBtnText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 14
  },
  voucherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  voucherIconBg: {
    backgroundColor: colors.gold,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  voucherInfo: {
    marginLeft: 12,
    flex: 1
  },
  voucherName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold'
  },
  voucherDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  voucherAction: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: 'bold'
  },
  emptyVouchers: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 24
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13
  },
  giftCardSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24
  },
  giftDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16
  },
  formGroup: {
    marginBottom: 16
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6
  },
  inputField: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 10,
    color: colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  amountToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amountToggle: {
    width: '23%',
    backgroundColor: colors.inputBg,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  amountToggleActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted
  },
  amountToggleText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold'
  },
  amountToggleTextActive: {
    color: colors.gold
  },
  textArea: {
    textAlignVertical: 'top',
    height: 70
  },
  sendGiftBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8
  },
  sendGiftBtnText: {
    color: '#12100e',
    fontSize: 15,
    fontWeight: 'bold'
  },
  settingsSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  logoutRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12
  },
  toggleContainer: {
    width: 48,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: 'center'
  },
  toggleContainerActive: {
    borderColor: '#c4a178'
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#aaa093'
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
    backgroundColor: '#c4a178'
  },
  // modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  lockedCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center'
  },
  lockedDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text
  },
  modalForm: {
    width: '100%'
  },
  modalFormGroup: {
    marginBottom: 16
  },
  modalInputLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text
  },
  saveBtn: {
    backgroundColor: colors.gold,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  saveBtnText: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold'
  }
});
