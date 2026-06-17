import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, StatusBar } from 'react-native';
import { useApp } from '../context/AppContext';

export default function SplashScreen() {
  const { setSplashDone, t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fefdfb" />
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>The Cheesecake House</Text>
        <Text style={styles.subtitle}>Premium Craft Cakes</Text>
      </View>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c4a178" />
        <Text style={styles.loadingText}>{t('loadingCakes')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefdfb', // signature cream background
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d241c', // warm chocolate text
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#c4a178', // gold text
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 6,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#7c7063',
    fontSize: 12,
    marginTop: 14,
  },
});
