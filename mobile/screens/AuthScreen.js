import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function AuthScreen({ reason, onClose }) {
  const { 
    colors, 
    login, 
    register, 
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginAsGuest, 
    t 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', or 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const subtitle = reason || t('connectingOrRegistering');

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess('');
    
    let successResult = false;
    
    if (activeTab === 'login') {
      successResult = await login(email, password);
    } else if (activeTab === 'register') {
      successResult = await register(name, email, phone, password);
    } else if (activeTab === 'forgot') {
      successResult = await resetPassword(email);
      if (successResult) {
        setSuccess('Un email de resetare a parolei a fost trimis pe adresa ta.');
      }
    }

    setLoading(false);
    if (successResult && activeTab !== 'forgot' && onClose) {
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const successResult = await loginWithGoogle();
    setLoading(false);
    if (successResult && onClose) {
      onClose();
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const successResult = await loginWithFacebook();
    setLoading(false);
    if (successResult && onClose) {
      onClose();
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    const successResult = await loginWithApple();
    setLoading(false);
    if (successResult && onClose) {
      onClose();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={loading}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        {/* Logo and Brand */}
        <View style={styles.brandContainer}>
          <Image 
            source={{ uri: 'https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png' }} 
            style={[styles.logo, { tintColor: colors.text }]}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>The Cheesecake House</Text>
          <Text style={styles.subtitle}>
            {activeTab === 'forgot' ? 'Recuperare parolă cont' : subtitle}
          </Text>
        </View>

        {/* Custom Tabs */}
        {activeTab !== 'forgot' && (
          <View style={[styles.tabContainer, { backgroundColor: colors.inputBg }]}>
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'login' && [styles.activeTabBtn, { backgroundColor: colors.cardBg }]
              ]}
              onPress={() => setActiveTab('login')}
              disabled={loading}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'login' ? colors.text : colors.textMuted }
              ]}>
                {t('cconnect')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'register' && [styles.activeTabBtn, { backgroundColor: colors.cardBg }]
              ]}
              onPress={() => setActiveTab('register')}
              disabled={loading}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'register' ? colors.text : colors.textMuted }
              ]}>
                {t('cnew')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Form Fields */}
        <View style={styles.formContainer}>
          {success ? (
            <Text style={styles.successText}>{success}</Text>
          ) : null}

          {activeTab === 'register' && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('fullName')}</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Popescu Andrei"
                  placeholderTextColor={colors.textMuted}
                  editable={!loading}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('phone')}</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Ex: 0755 123 456"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </>
          )}

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('email')}</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Ex: andrei@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {activeTab !== 'forgot' && (
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('password') || 'Parolă'}</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
              
              {activeTab === 'login' && (
                <TouchableOpacity 
                  style={styles.forgotLink} 
                  onPress={() => {
                    setActiveTab('forgot');
                    setSuccess('');
                  }}
                  disabled={loading}
                >
                  <Text style={[styles.forgotLinkText, { color: colors.gold }]}>Ai uitat parola?</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'Se încarcă...' : (
                activeTab === 'login' 
                  ? t('cconnect') 
                  : activeTab === 'register' 
                    ? t('cnew') 
                    : 'Trimite email'
              )}
            </Text>
          </TouchableOpacity>

          {activeTab === 'forgot' && (
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => {
                setActiveTab('login');
                setSuccess('');
              }}
              disabled={loading}
            >
              <Text style={[styles.backBtnText, { color: colors.text }]}>Înapoi la conectare</Text>
            </TouchableOpacity>
          )}

          {/* Guest Button - only when not in forgot password mode */}
          {activeTab !== 'forgot' && (
            <TouchableOpacity style={styles.guestLinkBtn} onPress={loginAsGuest} disabled={loading}>
              <Text style={[styles.guestLinkBtnText, { color: colors.gold }]}>
                {t('continueAsGuest')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Social Logins - only when not in forgot password mode */}
          {activeTab !== 'forgot' && (
            <View style={styles.socialContainer}>
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>sau conectează-te cu</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity 
                  style={[styles.socialBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                  <Text style={[styles.socialBtnText, { color: colors.text }]}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
                  onPress={handleFacebookLogin}
                  disabled={loading}
                >
                  <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                  <Text style={[styles.socialBtnText, { color: colors.text }]}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
                  onPress={handleAppleLogin}
                  disabled={loading}
                >
                  <Ionicons name="logo-apple" size={18} color={colors.text} />
                  <Text style={[styles.socialBtnText, { color: colors.text }]}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#c4a178',
    marginTop: 4,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 21,
    alignItems: 'center',
  },
  activeTabBtn: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgotLinkText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    backgroundColor: '#c4a178',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  submitBtnText: {
    color: '#12100e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  guestLinkBtn: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#c4a178',
  },
  guestLinkBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    color: '#28a745',
    borderColor: 'rgba(40, 167, 69, 0.2)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
  socialContainer: {
    marginTop: 24,
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
