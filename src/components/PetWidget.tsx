import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updatePetHappiness } from '../store/slices/userSlice';
import { BIOMES } from '../constants/biomes';

export default function PetWidget() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  
  // Animation values
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const happinessAnim = useRef(new Animated.Value(0)).current;
  
  if (!user) return null;

  const currentBiome = user.currentBiome;
  const biomeTheme = BIOMES[currentBiome];
  const pet = user.pet;

  useEffect(() => {
    // Animate happiness bar
    Animated.timing(happinessAnim, {
      toValue: pet.happiness / 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Pet bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, [pet.happiness]);

  const getPetEmoji = () => {
    const stage = pet.evolutionStage;
    switch (pet.type) {
      case 'pig':
        return stage === 0 ? '🐷' : stage === 1 ? '🐖' : '🐗';
      case 'chicken':
        return stage === 0 ? '🐣' : stage === 1 ? '🐤' : '🐓';
      case 'wolf':
        return stage === 0 ? '🐺' : stage === 1 ? '🐕' : '🦮';
      case 'creeper':
        return stage === 0 ? '💚' : stage === 1 ? '🟢' : '💥';
      default:
        return '🐷';
    }
  };

  const getHappinessColor = () => {
    if (pet.happiness >= 80) return '#4CAF50';
    if (pet.happiness >= 50) return '#FF9800';
    return '#F44336';
  };

  const getHappinessMessage = () => {
    if (pet.happiness >= 90) return "Ecstatic! 🌟";
    if (pet.happiness >= 70) return "Very Happy 😊";
    if (pet.happiness >= 50) return "Content 😌";
    if (pet.happiness >= 30) return "Okay 😐";
    return "Needs Care 😢";
  };

  const feedPet = () => {
    // Feed animation
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(updatePetHappiness(Math.min(100, pet.happiness + 20)));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        style={styles.petCard}
      >
        <View style={styles.petHeader}>
          <Text style={styles.petTitle}>Your Companion</Text>
          <Text style={styles.happinessMessage}>{getHappinessMessage()}</Text>
        </View>

        <View style={styles.petContent}>
          {/* Pet Avatar */}
          <View style={styles.petAvatarSection}>
            <Animated.View 
              style={[
                styles.petAvatarContainer,
                { transform: [{ scale: bounceAnim }] }
              ]}
            >
              <LinearGradient
                colors={[biomeTheme.accentColor + '40', biomeTheme.primaryColor + '20']}
                style={styles.petAvatarGradient}
              >
                <Text style={styles.petEmoji}>{getPetEmoji()}</Text>
              </LinearGradient>
            </Animated.View>
            
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petType}>
                Level {pet.evolutionStage + 1} {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
              </Text>
            </View>
          </View>

          {/* Happiness Section */}
          <View style={styles.happinessSection}>
            <View style={styles.happinessHeader}>
              <Text style={styles.happinessLabel}>Happiness</Text>
              <Text style={styles.happinessValue}>{pet.happiness}%</Text>
            </View>
            
            <View style={styles.happinessBarContainer}>
              <Animated.View 
                style={[
                  styles.happinessBarFill,
                  { 
                    width: happinessAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: getHappinessColor()
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Feed Button */}
        <TouchableOpacity 
          style={styles.feedButton}
          onPress={feedPet}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
            style={styles.feedButtonGradient}
          >
            <Text style={styles.feedButtonText}>Feed Pet 🍖</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  petCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  
  // Header Section - Headspace style
  petHeader: {
    marginBottom: 20,
  },
  petTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  happinessMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  
  // Pet Content - Zen-like layout
  petContent: {
    marginBottom: 20,
  },
  petAvatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  petAvatarContainer: {
    marginRight: 16,
  },
  petAvatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  petEmoji: {
    fontSize: 32,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  petType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  // Happiness Section - Mindful design
  happinessSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  happinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  happinessLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  happinessValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  happinessBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  happinessBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Feed Button - Headspace CTA style
  feedButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  feedButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});