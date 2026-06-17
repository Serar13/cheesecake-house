import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const PRODUCTS = [
  { id: 'p1', name: 'Cheesecake Clasic New York', desc: 'Rețeta originală, fină și cremoasă cu sos de fructe de pădure.', price: 24, category: 'cheesecake' },
  { id: 'p2', name: 'Cheesecake cu Fistic premium', desc: 'Cremă fină de brânză îmbogățită cu fistic de Bronte și glazură catifelată.', price: 28, category: 'cheesecake' },
  { id: 'p3', name: 'Cheesecake Belgian Chocolate', desc: 'Blat crocant cu cacao, cremă bogată cu ciocolată belgiană fină.', price: 26, category: 'cheesecake' },
  { id: 'p4', name: 'Cappuccino Cremoso', desc: 'Espresso dublu premium, lapte spumat fin și un praf de cacao deasupra.', price: 14, category: 'cafe' },
  { id: 'p5', name: 'Flat White Special', desc: 'Espresso dublu de specialitate cu lapte cremos, ideal pentru dimineți.', price: 16, category: 'cafe' },
  { id: 'p6', name: 'Limonadă cu Căpșuni și Busuioc', desc: 'Limonadă proaspătă, infuzată cu căpșuni dulci și frunze de busuioc.', price: 18, category: 'drinks' },
  { id: 'p7', name: 'Cheesecake Lavandă și Miere 🤫', desc: 'Ediție secretă cu note delicate de lavandă organică și miere locală de albine.', price: 29, category: 'secret' }
];

export default function HomeScreen() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, balance, payWithWallet, colors, isLoggedIn, requestAuth: openAuth, t } = useApp();
  const styles = getStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartVisible, setCartVisible] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('Cluj-Napoca');
  const [pickupTime, setPickupTime] = useState('15 minute');

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!isLoggedIn) {
      promptAuth(t('connectingOrRegistering'));
      return;
    }
    
    if (balance < cartTotal) {
      Alert.alert(
        t('insufficientFunds'),
        `${t('insufficientFunds')}: ${balance} RON < ${cartTotal} RON`,
        [{ text: 'OK' }]
      );
      return;
    }

    const success = payWithWallet(cartTotal);
    if (success) {
      Alert.alert(
        'Comandă Plasată!',
        `Comanda a fost trimisă cu succes la locația din ${pickupLocation}.\n\nVa fi pregătită în ${pickupTime}.\nSuma de ${cartTotal} RON a fost reținută din portofel. Ai primit ștampile în programul de loialitate!`,
        [
          { 
            text: 'Super!', 
            onPress: () => {
              clearCart();
              setCartVisible(false);
            } 
          }
        ]
      );
    }
  };

  const categories = [
    { id: 'all', name: t('all') || 'Toate', icon: 'grid-outline' },
    { id: 'cheesecake', name: 'Cheesecake', icon: 'pizza-outline' },
    { id: 'cafe', name: t('cafe') || 'Cafea', icon: 'cafe-outline' },
    { id: 'drinks', name: t('drinks') || 'Răcoritoare', icon: 'beer-outline' },
    { id: 'secret', name: t('secretMenu') || 'Meniu Secret 🤫', icon: 'key-outline' }
  ];

  return (
    <View style={styles.container}>
      {/* Category List */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.categoryButton, 
                selectedCategory === cat.id && styles.categoryButtonActive,
                cat.id === 'secret' && styles.secretCategoryButton
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons 
                name={cat.icon} 
                size={16} 
                color={selectedCategory === cat.id ? '#12100e' : (cat.id === 'secret' ? colors.gold : colors.textMuted)} 
              />
              <Text style={[
                styles.categoryText, 
                selectedCategory === cat.id && styles.categoryTextActive,
                cat.id === 'secret' && styles.secretCategoryText
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList 
        data={filteredProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.productCard, item.category === 'secret' && styles.secretProductCard]}>
            <View style={styles.productInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.productName}>{item.name}</Text>
                {item.category === 'secret' && (
                  <View style={styles.secretBadge}>
                    <Text style={styles.secretBadgeText}>{t('secretBadge')}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.productDesc}>{item.desc}</Text>
              <Text style={styles.productPrice}>{item.price} RON</Text>
            </View>
            <TouchableOpacity 
              style={[styles.addButton, item.category === 'secret' && styles.secretAddButton]} 
              onPress={() => {
                addToCart(item);
                Alert.alert(t('addedToCart'), `${item.name} -> ${t('addedToCart')}`);
              }}
            >
              <Ionicons name="add" size={20} color="#1b1713" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={() => setCartVisible(true)}>
          <View style={styles.cartLeft}>
            <Ionicons name="cart" size={24} color="#12100e" />
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{cart.reduce((s, i) => s + i.quantity, 0)}</Text>
            </View>
          </View>
          <Text style={styles.cartCenter}>{t('cartTitle')}</Text>
          <Text style={styles.cartRight}>{cartTotal} RON</Text>
        </TouchableOpacity>
      )}

      {/* Cart & Pre-order Checkout Modal */}
      <Modal visible={cartVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cartTitle')}</Text>
              <TouchableOpacity onPress={() => setCartVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartList}>
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{item.price} RON / buc</Text>
                  </View>
                  <View style={styles.cartItemControls}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={16} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                      <Ionicons name="add" size={16} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={18} color="#e57373" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Checkout Configurations */}
            <View style={styles.checkoutConfig}>
              <Text style={styles.configLabel}>{t('pickupLoc')}</Text>
              <View style={styles.rowPicker}>
                {['Cluj-Napoca', 'Bistrița', 'Târgu Mureș'].map(loc => (
                  <TouchableOpacity 
                    key={loc}
                    style={[styles.pickerOption, pickupLocation === loc && styles.pickerOptionActive]}
                    onPress={() => setPickupLocation(loc)}
                  >
                    <Text style={[styles.pickerText, pickupLocation === loc && styles.pickerTextActive]}>
                      {loc.split('-')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.configLabel}>{t('pickupTimeLabel')}</Text>
              <View style={styles.rowPicker}>
                {['15 minute', '30 minute', '1 oră'].map(t => (
                  <TouchableOpacity 
                    key={t}
                    style={[styles.pickerOption, pickupTime === t && styles.pickerOptionActive]}
                    onPress={() => setPickupTime(t)}
                  >
                    <Text style={[styles.pickerText, pickupTime === t && styles.pickerTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Total and Pay Button */}
            <View style={styles.modalFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>{cartTotal} RON</Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Sold curent:</Text>
                <Text style={[styles.balanceValue, balance < cartTotal ? styles.insufficient : styles.sufficient]}>
                  {balance} RON
                </Text>
              </View>
              
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Ionicons name="wallet-outline" size={20} color="#1b1713" style={{ marginRight: 8 }} />
                <Text style={styles.checkoutButtonText}>{t('checkoutButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  categoryContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBg
  },
  categoryScroll: {
    paddingHorizontal: 16
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  categoryButtonActive: {
    backgroundColor: colors.gold
  },
  secretCategoryButton: {
    borderColor: colors.gold,
    borderWidth: 1
  },
  categoryText: {
    color: colors.textMuted,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600'
  },
  categoryTextActive: {
    color: '#12100e'
  },
  secretCategoryText: {
    color: colors.gold
  },
  listContent: {
    padding: 16,
    paddingBottom: 100
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  secretProductCard: {
    borderColor: colors.gold,
    borderWidth: 1.5
  },
  productInfo: {
    flex: 1,
    marginRight: 12
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  productName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold'
  },
  secretBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8
  },
  secretBadgeText: {
    color: '#12100e',
    fontSize: 10,
    fontWeight: 'bold'
  },
  productDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16
  },
  productPrice: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: 'bold'
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secretAddButton: {
    backgroundColor: colors.text
  },
  floatingCart: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  badgeCount: {
    backgroundColor: '#12100e',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6
  },
  badgeText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: 'bold'
  },
  cartCenter: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cartRight: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold'
  },
  cartList: {
    padding: 20,
    maxHeight: 250
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12
  },
  cartItemInfo: {
    flex: 1
  },
  cartItemName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  cartItemPrice: {
    color: colors.gold,
    fontSize: 12,
    marginTop: 2
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  qtyBtn: {
    backgroundColor: colors.inputBg,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyText: {
    color: colors.text,
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  deleteBtn: {
    marginLeft: 14,
    padding: 4
  },
  checkoutConfig: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  configLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8
  },
  rowPicker: {
    flexDirection: 'row',
    marginBottom: 8
  },
  pickerOption: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  pickerOptionActive: {
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
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
    paddingTop: 16
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 15
  },
  totalValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold'
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  balanceLabel: {
    color: colors.textMuted,
    fontSize: 13
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  insufficient: {
    color: '#e57373'
  },
  sufficient: {
    color: '#81c784'
  },
  checkoutButton: {
    backgroundColor: colors.gold,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  checkoutButtonText: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
