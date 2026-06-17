import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const TABLES_CONFIG = {
  'Cluj-Napoca': [
    { id: 'C1', name: 'Masa 1', seats: 2, status: 'available', x: 17, y: 83, descRo: 'Interior Stânga-Jos', descEn: 'Indoor Left-Bottom', descHu: 'Belső Bal-Lent' },
    { id: 'C2', name: 'Masa 2', seats: 2, status: 'booked', x: 32, y: 83, descRo: 'Interior Centru-Jos', descEn: 'Indoor Center-Bottom', descHu: 'Belső Közép-Lent' },
    { id: 'C3', name: 'Masa 3', seats: 2, status: 'available', x: 17, y: 71, descRo: 'Interior Stânga-Mijloc', descEn: 'Indoor Left-Mid', descHu: 'Belső Bal-Közép' },
    { id: 'C4', name: 'Masa 4', seats: 2, status: 'available', x: 32, y: 71, descRo: 'Interior Centru-Mijloc', descEn: 'Indoor Center-Mid', descHu: 'Belső Közép-Közép' },
    { id: 'C5', name: 'Masa 5', seats: 2, status: 'booked', x: 17, y: 58.5, descRo: 'Interior Stânga-Sus', descEn: 'Indoor Left-Top', descHu: 'Belső Bal-Fent' },
    { id: 'C6', name: 'Masa 6', seats: 2, status: 'available', x: 32, y: 58.5, descRo: 'Interior Centru-Sus', descEn: 'Indoor Center-Top', descHu: 'Belső Közép-Fent' },
    { id: 'C7', name: 'Masa 7', seats: 2, status: 'available', x: 17, y: 45.5, descRo: 'Interior Stânga-Fiecare (Sus)', descEn: 'Indoor Left-Top (Upper)', descHu: 'Belső Bal-Fent (Felső)' },
    { id: 'C8', name: 'Masa 8', seats: 2, status: 'available', x: 49.5, y: 83, descRo: 'Interior Dreapta-Jos (Lângă Bucătărie)', descEn: 'Indoor Right-Bottom (Near Kitchen)', descHu: 'Belső Jobb-Lent (Konyha mellett)' },
    { id: 'C9', name: 'Masa 9', seats: 4, status: 'available', x: 79, y: 30.5, descRo: 'Terasă Outdoor (Sus)', descEn: 'Outdoor Terrace (Top)', descHu: 'Kültéri terasz (Fent)' },
    { id: 'C10', name: 'Masa 10', seats: 4, status: 'booked', x: 79, y: 55, descRo: 'Terasă Outdoor (Mijloc)', descEn: 'Outdoor Terrace (Mid)', descHu: 'Kültéri terasz (Közép)' },
    { id: 'C11', name: 'Masa 11', seats: 4, status: 'available', x: 79, y: 76.5, descRo: 'Terasă Outdoor (Jos)', descEn: 'Outdoor Terrace (Bottom)', descHu: 'Kültéri terasz (Lent)' }
  ],
  'Bistrița': [
    { id: 'B1', name: 'Masa 1', seats: 2, status: 'available', x: 26.5, y: 31, descRo: 'Arcadă Stânga', descEn: 'Arch Left', descHu: 'Bal oldali árkád' },
    { id: 'B2', name: 'Masa 2', seats: 2, status: 'available', x: 38.5, y: 30.5, descRo: 'Arcadă Centru-Stânga', descEn: 'Arch Center-Left', descHu: 'Közép-bal oldali árkád' },
    { id: 'B3', name: 'Masa 3', seats: 2, status: 'booked', x: 51, y: 30.5, descRo: 'Arcadă Centru-Dreapta', descEn: 'Arch Center-Right', descHu: 'Közép-jobb oldali árkád' },
    { id: 'B4', name: 'Masa 4', seats: 2, status: 'available', x: 63, y: 31, descRo: 'Arcadă Dreapta', descEn: 'Arch Right', descHu: 'Jobb oldali árkád' },
    { id: 'B5', name: 'Masa 5', seats: 2, status: 'available', x: 27, y: 49.5, descRo: 'Mijloc Stânga', descEn: 'Center Left', descHu: 'Közép bal' },
    { id: 'B6', name: 'Masa 6', seats: 2, status: 'available', x: 44, y: 47, descRo: 'Mijloc Dreapta', descEn: 'Center Right', descHu: 'Közép jobb' },
    { id: 'B7', name: 'Masa 7', seats: 2, status: 'booked', x: 25.5, y: 72, descRo: 'Boutique Stânga-Jos', descEn: 'Boutique Left-Bottom', descHu: 'Boutique bal-lent' }
  ],
  'Târgu Mureș': [
    { id: 'T1', name: 'Masa 1', seats: 2, status: 'available', x: 29, y: 80, descRo: 'Lângă Intrare', descEn: 'Near Entrance', descHu: 'Bejárat mellett' },
    { id: 'T2', name: 'Masa 2', seats: 4, status: 'available', x: 59, y: 40, descRo: 'Zona Centrală (Sus)', descEn: 'Center Zone (Top)', descHu: 'Középső zóna (Fent)' },
    { id: 'T3', name: 'Masa 3', seats: 4, status: 'booked', x: 59, y: 54, descRo: 'Zona Centrală (Mijloc)', descEn: 'Center Zone (Mid)', descHu: 'Középső zóna (Közép)' },
    { id: 'T4', name: 'Masa 4', seats: 4, status: 'available', x: 60, y: 68, descRo: 'Zona Centrală (Jos)', descEn: 'Center Zone (Bottom)', descHu: 'Középső zóna (Lent)' },
    { id: 'T5', name: 'Masa 5', seats: 2, status: 'available', x: 76, y: 36, descRo: 'Canapea Sepeu (Sus)', descEn: 'Sofa Booth (Top)', descHu: 'Boxos kanapé (Fent)' },
    { id: 'T6', name: 'Masa 6', seats: 2, status: 'available', x: 76, y: 49, descRo: 'Canapea Sepeu (Mijloc-Sus)', descEn: 'Sofa Booth (Mid-Top)', descHu: 'Boxos kanapé (Közép-Fent)' },
    { id: 'T7', name: 'Masa 7', seats: 2, status: 'booked', x: 76, y: 61, descRo: 'Canapea Sepeu (Mijloc-Jos)', descEn: 'Sofa Booth (Mid-Bottom)', descHu: 'Boxos kanapé (Közép-Lent)' },
    { id: 'T8', name: 'Masa 8', seats: 2, status: 'booked', x: 76, y: 74, descRo: 'Canapea Sepeu (Jos)', descEn: 'Sofa Booth (Bottom)', descHu: 'Boxos kanapé (Lent)' }
  ]
};

const PREORDER_PRODUCTS = [
  { id: 'p1', name: 'Cheesecake Clasic New York', price: 24, key: 'classic_cheesecake' },
  { id: 'p2', name: 'Cheesecake cu Fistic premium', price: 28, key: 'pistachio_cheesecake' },
  { id: 'p3', name: 'Cheesecake Belgian Chocolate', price: 26, key: 'chocolate_cheesecake' },
  { id: 'p4', name: 'Cappuccino Cremoso', price: 14, key: 'cappuccino' },
  { id: 'p5', name: 'Flat White Special', price: 16, key: 'flat_white' }
];

const LAYOUT_IMAGES = {
  'Cluj-Napoca': require('../assets/cluj_3d.png'),
  'Bistrița': require('../assets/bistrita_3d.png'),
  'Târgu Mureș': require('../assets/mures_3d.png')
};

export default function ReservationsScreen() {
  const { reservations, addReservation, colors, isLoggedIn, requestAuth: openAuth, language, t } = useApp();
  const styles = getStyles(colors);
  const [location, setLocation] = useState('Cluj-Napoca');
  const [guests, setGuests] = useState(2);
  const [day, setDay] = useState('Astăzi');
  const [time, setTime] = useState('19:30');
  const [selectedTable, setSelectedTable] = useState(null);

  const getTableDesc = (table) => {
    if (language === 'ro') return table.descRo;
    if (language === 'en') return table.descEn;
    return table.descHu || table.descRo;
  };
  
  // Pre-Order Quantities mapping: { productId: quantity }
  const [preOrderQuantities, setPreOrderQuantities] = useState({});

  const tables = TABLES_CONFIG[location] || [];

  const handleQuantityChange = (productId, change) => {
    setPreOrderQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + change;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const promptAuth = (reason) => {
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

  const handleBook = () => {
    if (!isLoggedIn) {
      promptAuth(t('needAccountDesc'));
      return;
    }

    if (!selectedTable) {
      Alert.alert(t('error'), t('selectAvailableTableError'));
      return;
    }

    // Compile pre-ordered items
    const preOrderItems = Object.keys(preOrderQuantities).map(id => {
      const prod = PREORDER_PRODUCTS.find(p => p.id === id);
      return {
        name: prod.name,
        quantity: preOrderQuantities[id],
        price: prod.price
      };
    });

    const newRes = {
      location,
      table: `${selectedTable.name} (${getTableDesc(selectedTable)})`,
      date: `${day}, la ora ${time}`,
      guests,
      preOrder: preOrderItems
    };

    addReservation(newRes);
    
    // Alert confirmation details
    let summaryText = `${selectedTable.name}\n${day}, ora ${time}\n${guests} persoane`;
    if (preOrderItems.length > 0) {
      summaryText += `\n\nPre-comandă:\n` + preOrderItems.map(item => `${item.quantity}x ${item.name}`).join('\n');
    }

    Alert.alert(
      t('confirmReservationTitle'),
      `Te așteptăm la The Cheesecake House ${location}!\n\nDetalii:\n${summaryText}`,
      [{ text: 'OK' }]
    );

    // Reset Form
    setSelectedTable(null);
    setPreOrderQuantities({});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      {/* Configuration Card */}
      <View style={styles.configCard}>
        {/* Location Picker */}
        <Text style={styles.sectionLabel}>{t('chooseLocation')}</Text>
        <View style={styles.pickerRow}>
          {['Cluj-Napoca', 'Bistrița', 'Târgu Mureș'].map(loc => (
            <TouchableOpacity 
              key={loc}
              style={[styles.pickerBtn, location === loc && styles.pickerBtnActive]}
              onPress={() => {
                setLocation(loc);
                setSelectedTable(null);
              }}
            >
              <Text style={[styles.pickerText, location === loc && styles.pickerTextActive]}>
                {loc.split('-')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selector */}
        <Text style={styles.sectionLabel}>{t('chooseDay')}</Text>
        <View style={styles.pickerRow}>
          {['Astăzi', 'Mâine', 'Poimâine'].map(d => (
            <TouchableOpacity 
              key={d}
              style={[styles.pickerBtn, day === d && styles.pickerBtnActive]}
              onPress={() => setDay(d)}
            >
              <Text style={[styles.pickerText, day === d && styles.pickerTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selector */}
        <Text style={styles.sectionLabel}>{t('timeSlot')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
          {['12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'].map(t => (
            <TouchableOpacity 
              key={t}
              style={[styles.timeBtn, time === t && styles.timeBtnActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[styles.timeText, time === t && styles.timeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Guests Counter */}
        <Text style={styles.sectionLabel}>{t('guestsNum')}</Text>
        <View style={styles.guestsRow}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <TouchableOpacity 
              key={num}
              style={[styles.guestBtn, guests === num && styles.guestBtnActive]}
              onPress={() => setGuests(num)}
            >
              <Text style={[styles.guestText, guests === num && styles.guestTextActive]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Layout Render */}
      <Text style={styles.sectionTitle}>{t('locationLayoutTitle')} ({location})</Text>
      <View style={styles.layoutCard}>
        <View style={styles.layoutImageContainer}>
          <Image 
            source={LAYOUT_IMAGES[location] || LAYOUT_IMAGES['Cluj-Napoca']} 
            style={styles.layoutImage} 
            resizeMode="cover"
          />
          {tables.map(table => {
            const isBooked = table.status === 'booked';
            const isSelected = selectedTable?.id === table.id;

            return (
              <TouchableOpacity
                key={table.id}
                disabled={isBooked}
                style={[
                  styles.tableOverlay,
                  { left: `${table.x}%`, top: `${table.y}%` },
                  isBooked && styles.tableOverlayBooked,
                  isSelected && styles.tableOverlaySelected,
                ]}
                onPress={() => setSelectedTable(table)}
              >
                <Text style={[
                  styles.overlayText,
                  isBooked && styles.overlayTextBooked,
                  isSelected && styles.overlayTextSelected
                ]}>
                  {table.id.replace(/[A-Z]/g, '')}
                </Text>
                <Text style={[
                  styles.overlaySeats,
                  isSelected && styles.overlaySeatsSelected
                ]}>
                  {table.seats}p
                </Text>
                {isSelected && (
                  <View style={styles.overlayCheckmark}>
                    <Ionicons name="checkmark" size={10} color={colors.cardBg} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { borderColor: colors.gold, backgroundColor: colors.cardBg === '#ffffff' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(18, 16, 14, 0.6)' }]} />
            <Text style={styles.legendText}>{t('tableAvailable')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { borderColor: '#a0a0a0', backgroundColor: colors.cardBg === '#ffffff' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)' }]} />
            <Text style={styles.legendText}>{t('tableBooked')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { borderColor: colors.gold, backgroundColor: colors.gold }]} />
            <Text style={styles.legendText}>{t('tableSelected')}</Text>
          </View>
        </View>
      </View>

      {/* Table Selector */}
      <Text style={styles.sectionTitle}>{t('availableTables')} {location}</Text>
      <View style={styles.tableList}>
        {tables.map(table => {
          const isSelected = selectedTable?.id === table.id;
          const isBooked = table.status === 'booked';

          return (
            <TouchableOpacity 
              key={table.id}
              disabled={isBooked}
              style={[
                styles.tableCard,
                isSelected && styles.tableCardSelected,
                isBooked && styles.tableCardBooked
              ]}
              onPress={() => setSelectedTable(table)}
            >
              <View style={styles.tableLeft}>
                <Ionicons 
                  name={isBooked ? "close-circle-outline" : (isSelected ? "checkbox" : "square-outline")} 
                  size={22} 
                  color={isBooked ? "#e57373" : (isSelected ? colors.gold : colors.textMuted)} 
                />
                <View style={styles.tableInfo}>
                  <Text style={[styles.tableName, isBooked && styles.tableTextBooked]}>
                    {table.name} ({table.seats} {table.seats === 1 ? 'loc' : 'locuri'})
                  </Text>
                  <Text style={styles.tableDesc}>{getTableDesc(table)}</Text>
                </View>
              </View>
              <Text style={[
                styles.tableStatus,
                isBooked ? styles.statusBooked : (isSelected ? styles.statusSelected : styles.statusAvailable)
              ]}>
                {isBooked ? t('tableBooked') : (isSelected ? t('tableSelected') : t('tableAvailable'))}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ADVANCED PRE-ORDER SECTION */}
      {selectedTable && (
        <View style={styles.preOrderCard}>
          <View style={styles.preOrderHeader}>
            <Ionicons name="cart-outline" size={20} color={colors.gold} />
            <Text style={styles.preOrderTitle}>{t('preOrderTitle')}</Text>
          </View>
          <Text style={styles.preOrderDesc}>{t('preOrderDesc')}</Text>
          
          <View style={styles.preOrderList}>
            {PREORDER_PRODUCTS.map(product => {
              const currentQty = preOrderQuantities[product.id] || 0;
              return (
                <View key={product.id} style={styles.preOrderItemRow}>
                  <View style={styles.preOrderProductInfo}>
                    <Text style={styles.preOrderProductName}>{product.name}</Text>
                    <Text style={styles.preOrderProductPrice}>{product.price} RON</Text>
                  </View>
                  
                  <View style={styles.qtyContainer}>
                    {currentQty > 0 ? (
                      <>
                        <TouchableOpacity 
                          style={styles.qtyBtn}
                          onPress={() => handleQuantityChange(product.id, -1)}
                        >
                          <Ionicons name="remove" size={16} color={colors.gold} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{currentQty}</Text>
                      </>
                    ) : null}
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityChange(product.id, 1)}
                    >
                      <Ionicons name="add" size={16} color={colors.gold} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.bookButton, !selectedTable && styles.bookButtonDisabled]}
        onPress={handleBook}
        disabled={!selectedTable}
      >
        <Text style={styles.bookButtonText}>{t('bookTableButton')}</Text>
      </TouchableOpacity>

      {/* Active Reservations list */}
      <Text style={styles.sectionTitle}>{t('activeReservations')}</Text>
      {reservations.length === 0 ? (
        <View style={styles.emptyReservations}>
          <Text style={styles.emptyText}>{t('noActiveReservations')}</Text>
        </View>
      ) : (
        reservations.map(res => (
          <View key={res.id} style={styles.resCard}>
            <View style={styles.resHeader}>
              <View style={styles.resLocationRow}>
                <Ionicons name="location" size={16} color={colors.gold} />
                <Text style={styles.resLocation}>{res.location}</Text>
              </View>
              <View style={styles.resBadge}>
                <Text style={styles.resBadgeText}>{res.status}</Text>
              </View>
            </View>
            <Text style={styles.resDetails}>{res.table}</Text>
            <Text style={styles.resTime}>{res.date} • {res.guests} persoane</Text>
            
            {/* Show Pre-Orders on Card if exists */}
            {res.preOrder && res.preOrder.length > 0 && (
              <View style={styles.resPreOrderContainer}>
                <Text style={styles.resPreOrderLabel}>🛒 Pre-comandă:</Text>
                {res.preOrder.map((item, idx) => (
                  <Text key={idx} style={styles.resPreOrderItem}>
                    • {item.quantity}x {item.name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))
      )}
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
  configCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 14
  },
  pickerBtn: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  pickerBtnActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted
  },
  pickerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold'
  },
  pickerTextActive: {
    color: colors.gold
  },
  timeScroll: {
    marginBottom: 14
  },
  timeBtn: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  timeBtnActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: 'bold'
  },
  timeTextActive: {
    color: colors.gold
  },
  guestsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  guestBtn: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  guestBtnActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted
  },
  guestText: {
    color: colors.textMuted,
    fontWeight: 'bold'
  },
  guestTextActive: {
    color: colors.gold
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8
  },
  tableList: {
    marginBottom: 16
  },
  tableCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  tableCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted
  },
  tableCardBooked: {
    opacity: 0.5,
    backgroundColor: colors.bg
  },
  tableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  tableInfo: {
    marginLeft: 12,
    flex: 1
  },
  tableName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold'
  },
  tableTextBooked: {
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  tableDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  tableStatus: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  statusAvailable: {
    color: '#81c784'
  },
  statusSelected: {
    color: colors.gold
  },
  statusBooked: {
    color: '#e57373'
  },
  preOrderCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20
  },
  preOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  preOrderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8
  },
  preOrderDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 14,
    lineHeight: 16
  },
  preOrderList: {
    marginTop: 4
  },
  preOrderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  preOrderProductInfo: {
    flex: 1,
    marginRight: 10
  },
  preOrderProductName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text
  },
  preOrderProductPrice: {
    fontSize: 11,
    color: colors.gold,
    marginTop: 2,
    fontWeight: '600'
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 18,
    padding: 2
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 8
  },
  bookButton: {
    backgroundColor: colors.gold,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  bookButtonDisabled: {
    backgroundColor: colors.inputBg,
    opacity: 0.6
  },
  bookButtonText: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyReservations: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13
  },
  resCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  resHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  resLocationRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  resLocation: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6
  },
  resBadge: {
    backgroundColor: 'rgba(129, 199, 132, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  resBadgeText: {
    color: '#81c784',
    fontSize: 10,
    fontWeight: 'bold'
  },
  resDetails: {
    color: colors.gold,
    fontSize: 13,
    marginBottom: 4
  },
  resTime: {
    color: colors.textMuted,
    fontSize: 12
  },
  resPreOrderContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  resPreOrderLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4
  },
  resPreOrderItem: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },
  layoutCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  layoutImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.inputBg,
  },
  layoutImage: {
    width: '100%',
    height: '100%',
  },
  tableOverlay: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.cardBg === '#ffffff' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(18, 16, 14, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -22,
    marginTop: -22,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tableOverlayBooked: {
    borderColor: '#a0a0a0',
    backgroundColor: colors.cardBg === '#ffffff' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  tableOverlaySelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  overlayText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 13,
  },
  overlayTextBooked: {
    color: colors.cardBg === '#ffffff' ? '#707070' : '#808080',
    textDecorationLine: 'line-through',
  },
  overlayTextSelected: {
    color: '#12100e',
  },
  overlaySeats: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 1,
    lineHeight: 9,
  },
  overlaySeatsSelected: {
    color: 'rgba(18, 16, 14, 0.8)',
  },
  overlayCheckmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    width: '100%',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  layoutToggleRow: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
    justifyContent: 'space-between',
  },
  layoutToggleBtn: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  layoutToggleBtnActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldMuted,
  },
  layoutToggleText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  layoutToggleTextActive: {
    color: colors.gold,
  }
});
