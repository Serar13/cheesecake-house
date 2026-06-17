import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  Modal, 
  StyleSheet,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import LoyaltyScreen from '../screens/LoyaltyScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OffersScreen from '../screens/OffersScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme, colors, splashDone, isLoggedIn, isGuest, language, setLanguage, t } = useApp();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  // Close profile modal if auth is requested or logged out
  useEffect(() => {
    if (!isLoggedIn && !isGuest) {
      setProfileVisible(false);
    }
  }, [isLoggedIn, isGuest]);

  if (!splashDone) {
    return <SplashScreen />;
  }

  if (!isLoggedIn && !isGuest) {
    return <AuthScreen />;
  }

  const getFlag = (lang) => {
    if (lang === 'ro') return '🇷🇴 RO';
    if (lang === 'en') return '🇬🇧 EN';
    if (lang === 'hu') return '🇭🇺 HU';
    return 'RO';
  };

  const getRoyalSupplierText = () => {
    if (language === 'ro') return '👑 FURNIZOR OFICIAL AL CASEI REGALE';
    if (language === 'en') return '👑 OFFICIAL SUPPLIER OF THE ROYAL HOUSE';
    if (language === 'hu') return '👑 A KIRÁLYI HÁZ HIVATALOS BESZÁLLÍTÓJA';
    return '👑 FURNIZOR OFICIAL AL CASEI REGALE';
  };

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size }) => {
              let iconName;
              const routeName = route.name;

              if (routeName === t('menu')) {
                iconName = focused ? 'restaurant' : 'restaurant-outline';
              } else if (routeName === t('loyalty')) {
                iconName = focused ? 'ribbon' : 'ribbon-outline';
              } else if (routeName === t('reservations')) {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (routeName === t('offers')) {
                iconName = focused ? 'pricetag' : 'pricetag-outline';
              } else {
                iconName = 'help-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={focused ? colors.gold : colors.textMuted} />;
            },
            tabBarActiveTintColor: colors.gold,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: {
              backgroundColor: colors.cardBg,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              paddingBottom: bottomInset,
              paddingTop: 8,
              height: 56 + bottomInset,
            },
            headerStyle: {
              backgroundColor: colors.cardBg,
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontFamily: 'System',
              fontWeight: 'bold',
              fontSize: 18,
              color: colors.gold,
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity 
                style={[styles.aboutBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => setAboutUsVisible(true)}
              >
                <Ionicons name="information-circle-outline" size={20} color={colors.gold} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity 
                  style={[styles.langBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  onPress={() => setLangModalVisible(true)}
                >
                  <Text style={[styles.langText, { color: colors.gold }]}>
                    {getFlag(language)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.profileHeaderBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  onPress={() => setProfileVisible(true)}
                >
                  <Ionicons name="person-circle-outline" size={20} color={colors.gold} />
                </TouchableOpacity>
              </View>
            ),
            sceneContainerStyle: {
              backgroundColor: colors.bg,
            }
          })}
        >
          <Tab.Screen name={t('menu')} component={HomeScreen} options={{ title: t('menuCatalog') }} />
          <Tab.Screen name={t('loyalty')} component={LoyaltyScreen} options={{ title: t('loyaltyClub') }} />
          <Tab.Screen name={t('reservations')} component={ReservationsScreen} options={{ title: t('bookTable') }} />
          <Tab.Screen name={t('offers')} component={OffersScreen} options={{ title: t('exclusiveOffers') }} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* PROFILE SCREEN MODAL */}
      <Modal
        visible={profileVisible}
        animationType="slide"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={[styles.modalScreenContainer, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
          {/* Custom Header */}
          <View style={[styles.modalHeader, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.modalBackBtn}
              onPress={() => setProfileVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitleText, { color: colors.gold }]}>{t('profileTitle')}</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <ProfileScreen />
        </View>
      </Modal>

      {/* ABOUT US MODAL */}
      <Modal
        visible={aboutUsVisible}
        animationType="slide"
        onRequestClose={() => setAboutUsVisible(false)}
      >
        <View style={[styles.modalScreenContainer, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
          {/* Custom Header */}
          <View style={[styles.modalHeader, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.modalBackBtn}
              onPress={() => setAboutUsVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitleText, { color: colors.gold }]}>{t('aboutUsTitle')}</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <AboutScreen />
        </View>
      </Modal>

      {/* LANGUAGE SELECTOR MODAL */}
      <Modal
        visible={langModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setLangModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language / Alege Limba</Text>
            
            <TouchableOpacity 
              style={[styles.langOption, language === 'ro' && { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setLanguage('ro');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.optionFlag}>🇷🇴</Text>
              <Text style={[styles.optionText, { color: colors.text }]}>Română</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langOption, language === 'en' && { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setLanguage('en');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.optionFlag}>🇬🇧</Text>
              <Text style={[styles.optionText, { color: colors.text }]}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langOption, language === 'hu' && { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setLanguage('hu');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.optionFlag}>🇭🇺</Text>
              <Text style={[styles.optionText, { color: colors.text }]}>Magyar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  aboutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  profileHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  optionFlag: {
    fontSize: 22,
    marginRight: 12
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600'
  },
  // Modal Screen Styles
  modalScreenContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  modalBackBtn: {
    padding: 4,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
