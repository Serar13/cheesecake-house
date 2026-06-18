import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createOrder } from '../services/submissions';
import './CartSidebar.css';

export default function CartSidebar() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    clearCart,
    selectedStore,
    t,
    currentUser,
    setShowAuthModal
  } = useApp();

  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' or 'pickup'
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      }));
    } else {
      setFormData({ name: '', phone: '', address: '', notes: '' });
    }
  }, [currentUser]);

  if (!isCartOpen) return null;

  const transportFee = deliveryType === 'delivery' ? (cartTotal >= 100 ? 0 : 9.99) : 0;
  const grandTotal = cartTotal + transportFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Require authentication (Firestore rules require a signed-in user).
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setSubmitError('');
    setSubmitting(true);
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const id = await createOrder({
        userId: currentUser.uid,
        customerName: formData.name,
        locationId: selectedStore ? selectedStore.id : null,
        items,
        total: grandTotal,
        deliveryType,
        address: deliveryType === 'delivery' ? formData.address : '',
        notes: formData.notes,
      });

      setOrderId(id);
      setOrderSuccess(true);
    } catch (err) {
      console.error('createOrder failed:', err);
      setSubmitError(t('formSubmitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <h2>{t('cartTitle')}</h2>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {orderSuccess ? (
          /* Success Screen */
          <div className="order-success-container">
            <span className="success-icon">🎉</span>
            <h3>{t('orderSuccessTitle')}</h3>
            <p className="order-id-badge">{t('orderSuccessId')} <strong>{orderId}</strong></p>
            <p className="success-desc">
              {t('orderSuccessDesc')} <strong>{selectedStore?.name}</strong>.
            </p>
            <div className="summary-card">
              <h4>{t('orderSuccessDetails')}</h4>
              <p><strong>{t('orderSuccessName')}</strong> {formData.name}</p>
              <p><strong>{t('orderSuccessPhone')}</strong> {formData.phone}</p>
              {deliveryType === 'delivery' ? (
                <p><strong>{t('orderSuccessAddress')}</strong> {formData.address}</p>
              ) : (
                <p><strong>{t('orderSuccessPickup')}</strong> {selectedStore?.address}</p>
              )}
              <p className="success-total">{t('totalShortLabel')} <strong>{grandTotal.toFixed(2)} RON</strong></p>
            </div>
            <button className="success-close-btn" onClick={handleCloseSuccess}>
              {t('btnContinueShopping')}
            </button>
          </div>
        ) : (
          /* Normal Cart Content */
          <>
            {/* Scrollable Items list */}
            <div className="cart-items-container scroller">
              {cart.length === 0 ? (
                <div className="empty-cart-message">
                  <span className="empty-cart-icon">🧁</span>
                  <p>{t('cartEmpty')}</p>
                  <p className="empty-cart-sub">{t('cartEmptySub')}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="cart-item-img" 
                    />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <p className="cart-item-meta">{item.product.weight} • {item.product.price.toFixed(2)} RON</p>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-selector">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="cart-item-remove" 
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          {t('removeItem')}
                        </button>
                      </div>
                    </div>
                    <span className="cart-item-total">
                      {(item.product.price * item.quantity).toFixed(2)} RON
                    </span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              /* Checkout Details & Form */
              <div className="cart-checkout-section">
                
                {/* Delivery Type selector */}
                <div className="delivery-toggle-container">
                  <button 
                    type="button"
                    className={`toggle-option ${deliveryType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('delivery')}
                  >
                    {t('deliveryOption')}
                  </button>
                  <button 
                    type="button"
                    className={`toggle-option ${deliveryType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('pickup')}
                  >
                    {t('pickupOption')}
                  </button>
                </div>

                {/* Info Text */}
                {deliveryType === 'delivery' && (
                  <p className="delivery-info-text">
                    * {t('deliveryInfoLabel')} <strong>{selectedStore?.name?.replace('The Cheesecake House ', '')}</strong>.
                    {t('deliveryFreeText')}
                  </p>
                )}

                {/* Form or Auth Gate */}
                {currentUser ? (
                  <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="checkout-name">{t('inputName')}</label>
                      <input 
                        type="text" 
                        id="checkout-name"
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleInputChange}
                        placeholder={t('inputNamePlaceholder')}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="checkout-phone">{t('inputPhone')}</label>
                      <input 
                        type="tel" 
                        id="checkout-phone"
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        placeholder={t('inputPhonePlaceholder')}
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <div className="form-group">
                        <label htmlFor="checkout-address">{t('inputAddress')}</label>
                        <input 
                          type="text" 
                          id="checkout-address"
                          name="address" 
                          required 
                          value={formData.address} 
                          onChange={handleInputChange}
                          placeholder={t('inputAddressPlaceholder')}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="checkout-notes">{t('inputNotes')}</label>
                      <input 
                        type="text" 
                        id="checkout-notes"
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleInputChange}
                        placeholder={t('inputNotesPlaceholder')}
                      />
                    </div>

                    {/* Summary math */}
                    <div className="checkout-summary">
                      <div className="summary-row">
                        <span>{t('subtotalLabel')}</span>
                        <span>{cartTotal.toFixed(2)} RON</span>
                      </div>
                      {deliveryType === 'delivery' && (
                        <div className="summary-row">
                          <span>{t('shippingLabel')}</span>
                          <span>{transportFee === 0 ? t('freeLabel') : `${transportFee.toFixed(2)} RON`}</span>
                        </div>
                      )}
                      <div className="summary-row total-row">
                        <span>{t('totalLabel')}</span>
                        <span>{grandTotal.toFixed(2)} RON</span>
                      </div>
                    </div>

                    {submitError && (
                      <p className="form-error-text" style={{ color: '#c0392b', marginTop: '8px' }}>{submitError}</p>
                    )}

                    <button type="submit" className="place-order-btn" disabled={submitting}>
                      {submitting ? t('sendingGeneric') : `${t('btnPlaceOrder')} (${grandTotal.toFixed(2)} RON)`}
                    </button>
                  </form>
                ) : (
                  <div className="cart-auth-gate text-center">
                    <span className="gate-icon">🔒</span>
                    <h4>{t('cartAuthTitle')}</h4>
                    <p>{t('cartAuthDesc')}</p>
                    <button 
                      type="button" 
                      className="gate-login-btn"
                      onClick={() => setShowAuthModal(true)}
                    >
                      {t('cartAuthButton')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
