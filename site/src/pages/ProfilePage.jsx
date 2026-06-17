import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { 
    currentUser, 
    updateProfile, 
    deleteAccount, 
    topUpWallet, 
    useBirthdayVoucher,
    setShowAuthModal,
    logout,
    t
  } = useApp();

  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenEdit = () => {
    setName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setEditMode(true);
    setError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Numele nu poate fi gol.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateProfile(name, phone);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError('A apărut o eroare la salvarea profilului.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (amount) => {
    setLoading(true);
    try {
      await topUpWallet(amount);
      alert(`Alimentare reușită: +${amount} RON!`);
    } catch (err) {
      console.error(err);
      alert('Eroare la alimentarea portofelului.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseVoucher = () => {
    if (!currentUser?.birthdayVoucherActive) return;
    alert("Pentru a scana și folosi voucherul pentru o felie gratuită de cheesecake, te rugăm să descarci și să folosești aplicația noastră mobilă (disponibilă pe App Store și Google Play)!");
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      alert('Contul tău a fost șters cu succes.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Eroare la ștergerea contului. Din motive de securitate, este posibil să fie necesar să te reconectezi înainte de a șterge contul.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (userName) => {
    if (!userName) return 'CH';
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-page-container animate-fade-in">
      <div className="profile-page-content">

        {!currentUser ? (
          /* Guest Locked View */
          <div className="profile-locked-card">
            <div className="locked-icon">🔒</div>
            <h3 className="locked-title">Secțiune Blocată</h3>
            <p className="locked-desc">
              Această secțiune este destinată clienților cu cont. Conectează-te sau creează un cont în câteva secunde!
            </p>
            <button 
              className="profile-connect-btn" 
              onClick={() => setShowAuthModal(true)}
            >
              Conectare / Cont nou
            </button>
          </div>
        ) : editMode ? (
          /* Edit Profile Form */
          <form onSubmit={handleSaveProfile} className="profile-edit-card">
            <h3 className="profile-section-heading">Editează Profilul</h3>
            {error && <div className="profile-page-error">{error}</div>}
            <div className="profile-page-field">
              <label>Nume Complet</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Popescu Andrei"
                disabled={loading}
                required
              />
            </div>
            <div className="profile-page-field">
              <label>Număr Telefon</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0755 123 456"
                disabled={loading}
              />
            </div>
            <div className="profile-edit-buttons">
              <button type="submit" className="profile-save-button" disabled={loading}>
                {loading ? 'Se salvează...' : 'Salvează Modificările'}
              </button>
              <button 
                type="button" 
                className="profile-cancel-button" 
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Anulează
              </button>
            </div>
          </form>
        ) : (
          /* Profile Details View */
          <div className="profile-layout-grid">
            {/* Left Column: Info & Wallet */}
            <div className="profile-column">
              {/* Profile Card */}
              <div className="profile-details-card">
                <div className="profile-avatar-row">
                  <div className="profile-avatar-circle">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="profile-info-details">
                    <h4 className="user-name">{currentUser.name || 'Client'}</h4>
                    <p className="user-email">{currentUser.email}</p>
                    <p className="user-phone">{currentUser.phone || 'Fără număr de telefon'}</p>
                  </div>
                  <button className="user-edit-btn" onClick={handleOpenEdit} disabled={loading} title="Editează profilul">
                    ✏️
                  </button>
                </div>

                <div className="profile-details-divider" />

                <div className="profile-loyalty-row">
                  <div className="loyalty-stat">
                    <span className="stat-value">🎟️ {currentUser.stamps || 0}/9</span>
                    <span className="stat-label">Felii până la cadou</span>
                  </div>
                  <div className="loyalty-stat">
                    <span className="stat-value">✨ {currentUser.vipPoints || 0}</span>
                    <span className="stat-label">Puncte VIP</span>
                  </div>
                </div>

                <div className="profile-loyalty-nudge-box">
                  <span className="nudge-icon">📲</span>
                  <p className="nudge-text">
                    Pentru a acumula felii, puncte VIP și a le folosi în cofetării, descarcă <strong>aplicația mobilă</strong>!
                  </p>
                </div>
              </div>

              {/* Wallet Card */}
              <h3 className="profile-section-heading">Portofel Digital</h3>
              <div className="profile-wallet-display">
                <div className="wallet-card-header">
                  <span className="wallet-card-brand">THE CHEESECAKE HOUSE</span>
                  <span className="wallet-card-type">Card Portofel Digital</span>
                </div>
                <div className="wallet-card-balance">
                  <span className="balance-value">{(currentUser.balance || 0).toFixed(2)} RON</span>
                  <span className="balance-label">Soldul tău digital</span>
                </div>
                <div className="wallet-card-footer">
                  <span className="wallet-card-number">**** **** **** 1989</span>
                  <span className="wallet-card-nfc">📶</span>
                </div>
              </div>

              {/* Top Up Wallet */}
              <div className="topup-options-row">
                <button onClick={() => handleTopUp(50)} disabled={loading} className="wallet-topup-btn">+50 RON</button>
                <button onClick={() => handleTopUp(100)} disabled={loading} className="wallet-topup-btn">+100 RON</button>
                <button onClick={() => handleTopUp(200)} disabled={loading} className="wallet-topup-btn">+200 RON</button>
              </div>
            </div>

            {/* Right Column: Vouchers & Actions */}
            <div className="profile-column">
              {/* Vouchers */}
              <h3 className="profile-section-heading">Vouchere și Cadouri Active</h3>
              {currentUser.birthdayVoucherActive ? (
                <div className="birthday-voucher-box" onClick={handleUseVoucher}>
                  <div className="voucher-gift-icon">🎂</div>
                  <div className="voucher-text-details">
                    <span className="voucher-name-title">Felie Cadou de Ziua Ta!</span>
                    <span className="voucher-desc-text">O felie din orice cheesecake din meniu, gratuită.</span>
                  </div>
                  <button className="voucher-action-btn" disabled={loading}>Scan</button>
                </div>
              ) : (
                <div className="vouchers-empty-state">
                  Nu ai alte vouchere active momentan.
                </div>
              )}

              {/* Account Actions */}
              <div className="account-actions-box">
                <button onClick={handleLogout} className="account-logout-btn" disabled={loading}>
                  Deconectare Cont 🚪
                </button>

                {confirmDelete ? (
                  <div className="account-delete-confirm-box">
                    <p>Ești sigur că vrei să-ți ștergi contul definitiv? Toate datele tale și soldul vor fi pierdute.</p>
                    <div className="confirm-buttons-row">
                      <button onClick={handleDeleteAccount} className="delete-yes-btn" disabled={loading}>
                        Da, Șterge definitiv
                      </button>
                      <button onClick={() => setConfirmDelete(false)} className="delete-no-btn" disabled={loading}>
                        Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="account-delete-btn" disabled={loading}>
                    Șterge Contul 🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
