import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/slices/userSlice';
import { BiomeType } from '../types';
import { BIOMES } from '../constants/biomes';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [username, setUsername] = useState('');
  const [selectedBiome, setSelectedBiome] = useState<BiomeType>('forest');
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const handleCreateUser = () => {
    if (!username.trim()) {
      Alert.alert('Welcome!', 'Please enter your name to continue your journey');
      return;
    }
    
    // Exit animation before navigation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(createUser({ username: username.trim(), biome: selectedBiome }));
    });
  };

  const nextStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(2);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const biomeOptions: BiomeType[] = ['forest', 'desert', 'snowy'];

  if (step === 1) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Hero Illustration */}
          <View style={styles.heroSection}>
            <View style={styles.illustrationContainer}>
              <Text style={styles.heroEmoji}>🧱</Text>
              <View style={styles.floatingElements}>
                <Text style={[styles.floatingEmoji, styles.float1]}>✨</Text>
                <Text style={[styles.floatingEmoji, styles.float2]}>🌟</Text>
                <Text style={[styles.floatingEmoji, styles.float3]}>💫</Text>
              </View>
            </View>
            
            <Text style={styles.title}>Welcome to{'\n'}BlockHabits</Text>
            <Text style={styles.subtitle}>
              Transform your daily routines into an{'\n'}
              <Text style={styles.highlightText}>epic adventure</Text>
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>What should we call you?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
                placeholderTextColor="#8B9DC3"
                maxLength={20}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { opacity: username.trim() ? 1 : 0.6 }
            ]}
            onPress={nextStep}
            disabled={!username.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={username.trim() ? ['#4CAF50', '#45A049'] : ['#666', '#555']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>2 of 2</Text>
        </View>

        {/* Content */}
        <View style={styles.worldSection}>
          <Text style={styles.title}>Choose Your{'\n'}Starting World</Text>
          <Text style={styles.subtitle}>
            Each world offers a unique{'\n'}
            <Text style={styles.highlightText}>visual experience</Text>
          </Text>
        </View>

        {/* Biome Selection */}
        <ScrollView 
          style={styles.biomeList}
          showsVerticalScrollIndicator={false}
        >
          {biomeOptions.map((biome, index) => (
            <Animated.View
              key={biome}
              style={[
                styles.biomeCard,
                {
                  transform: [{
                    scale: selectedBiome === biome ? 1.02 : 1
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.biomeCardInner,
                  {
                    borderColor: selectedBiome === biome ? BIOMES[biome].accentColor : 'transparent',
                    borderWidth: selectedBiome === biome ? 2 : 0,
                  }
                ]}
                onPress={() => setSelectedBiome(biome)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[BIOMES[biome].backgroundColor, BIOMES[biome].primaryColor]}
                  style={styles.biomeGradient}
                >
                  <View style={styles.biomeContent}>
                    <Text style={styles.biomeEmoji}>
                      {biome === 'forest' ? '🌲' : biome === 'desert' ? '🏜️' : '❄️'}
                    </Text>
                    <View style={styles.biomeText}>
                      <Text style={[styles.biomeName, { color: BIOMES[biome].accentColor }]}>
                        {BIOMES[biome].name}
                      </Text>
                      <Text style={[styles.biomeDesc, { color: BIOMES[biome].secondaryColor }]}>
                        {biome === 'forest' && 'Perfect for beginners'}
                        {biome === 'desert' && 'Warm & energizing'}
                        {biome === 'snowy' && 'Cool & peaceful'}
                      </Text>
                    </View>
                    {selectedBiome === biome && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCreateUser}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[BIOMES[selectedBiome].primaryColor, BIOMES[selectedBiome].accentColor]}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Start Your Journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Step 1 Styles
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  heroEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 20,
  },
  float1: {
    top: 10,
    right: 20,
  },
  float2: {
    bottom: 15,
    left: 15,
  },
  float3: {
    top: 30,
    left: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  highlightText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  
  // Input Section
  inputSection: {
    width: '100%',
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    padding: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // Button Styles
  primaryButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Step 2 Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  stepIndicator: {
    color: '#8B9DC3',
    fontSize: 14,
    fontWeight: '500',
  },
  
  worldSection: {
    marginBottom: 40,
  },
  
  // Biome Selection
  biomeList: {
    flex: 1,
    marginBottom: 30,
  },
  biomeCard: {
    marginBottom: 16,
  },
  biomeCardInner: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  biomeGradient: {
    padding: 20,
  },
  biomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  biomeEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  biomeText: {
    flex: 1,
  },
  biomeName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  biomeDesc: {
    fontSize: 14,
    opacity: 0.8,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});