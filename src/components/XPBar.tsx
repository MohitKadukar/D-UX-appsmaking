import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BIOMES, LEVEL_XP_REQUIREMENT } from '../constants/biomes';

export default function XPBar() {
  const user = useSelector((state: RootState) => state.user.user);
  const currentBiome = user?.currentBiome || 'forest';
  const biomeTheme = BIOMES[currentBiome];

  // Headspace-style gentle animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  if (!user) return null;

  const currentLevelXP = user.totalXP % LEVEL_XP_REQUIREMENT;
  const progressPercentage = (currentLevelXP / LEVEL_XP_REQUIREMENT) * 100;
  const nextLevelXP = LEVEL_XP_REQUIREMENT - currentLevelXP;

  useEffect(() => {
    // Gentle progress animation
    Animated.timing(progressAnim, {
      toValue: progressPercentage / 100,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Subtle breathing pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [progressPercentage]);

  const getLevelMessage = () => {
    if (progressPercentage >= 90) return "Almost there! 🌟";
    if (progressPercentage >= 75) return "Great progress 💫";
    if (progressPercentage >= 50) return "Halfway there ✨";
    if (progressPercentage >= 25) return "Building momentum 🌱";
    return "Your journey begins 🌸";
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)']}
        style={styles.xpCard}
      >
        {/* Header Section - Zen-like spacing */}
        <View style={styles.header}>
          <View style={styles.levelSection}>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelNumber}>{user.level}</Text>
          </View>
          
          <View style={styles.xpSection}>
            <Text style={styles.xpLabel}>Experience</Text>
            <Text style={styles.xpText}>
              {currentLevelXP.toLocaleString()} / {LEVEL_XP_REQUIREMENT.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Motivational Message - Headspace style */}
        <Text style={styles.motivationalMessage}>
          {getLevelMessage()}
        </Text>

        {/* Progress Bar - Soft and mindful */}
        <View style={styles.progressSection}>
          <View style={styles.xpBarBackground}>
            <Animated.View style={styles.xpBarTrack}>
              <Animated.View
                style={[
                  styles.xpBarFill,
                  {
                    transform: [{
                      scaleX: progressAnim
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
                  style={styles.xpBarGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </Animated.View>
          </View>
          
          {/* Progress Indicator Dots - Headspace signature */}
          <View style={styles.progressDots}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: progressPercentage > (index * 25) 
                      ? biomeTheme.accentColor 
                      : 'rgba(255, 255, 255, 0.3)',
                  }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Next Level Info - Calm and encouraging */}
        <View style={styles.footer}>
          <Text style={styles.nextLevelText}>
            {nextLevelXP.toLocaleString()} XP until next level
          </Text>
          <Text style={styles.encouragementText}>
            Keep building your habits mindfully 🧘‍♀️
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  xpCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  
  // Header Section - Headspace zen layout
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  levelSection: {
    alignItems: 'flex-start',
  },
  levelLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  xpSection: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  xpText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Motivational Message - Headspace mindful messaging
  motivationalMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  
  // Progress Section - Soft and mindful
  progressSection: {
    marginBottom: 16,
  },
  xpBarBackground: {
    marginBottom: 12,
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Progress Dots - Headspace signature element
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Footer - Calm and encouraging
  footer: {
    alignItems: 'center',
  },
  nextLevelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  encouragementText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
});