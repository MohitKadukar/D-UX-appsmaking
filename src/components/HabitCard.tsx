import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit, BiomeTheme } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, isCompleted: boolean) => void;
  biomeTheme: BiomeTheme;
}

export default function HabitCard({ habit, onToggle, biomeTheme }: HabitCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const completionAnim = useRef(new Animated.Value(habit.isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(completionAnim, {
      toValue: habit.isCompleted ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [habit.isCompleted]);

  const handlePress = () => {
    // Micro-animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(habit.id, habit.isCompleted);
  };

  const getGrowthEmoji = (stage: number) => {
    switch (stage) {
      case 0: return '🌱'; // seed
      case 1: return '🌿'; // sprout
      case 2: return '🌳'; // growing
      case 3: return '🌲'; // mature
      default: return '🌱';
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 21) return '#FFD700'; // gold
    if (streak >= 14) return '#C0C0C0'; // silver
    if (streak >= 7) return '#CD7F32'; // bronze
    return 'rgba(255, 255, 255, 0.6)';
  };

  const getStreakBadgeText = (streak: number) => {
    if (streak >= 21) return '🏆 Legend';
    if (streak >= 14) return '🔥 On Fire';
    if (streak >= 7) return '⚡ Streak';
    return '';
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            habit.isCompleted 
              ? [biomeTheme.primaryColor, biomeTheme.accentColor]
              : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']
          }
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            {/* Left Section - Icon & Info */}
            <View style={styles.leftSection}>
              <View style={[
                styles.iconContainer,
                { 
                  backgroundColor: habit.isCompleted 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : biomeTheme.primaryColor + '40'
                }
              ]}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
              </View>
              
              <View style={styles.habitInfo}>
                <Text style={[
                  styles.habitName,
                  { color: habit.isCompleted ? '#FFFFFF' : '#FFFFFF' }
                ]}>
                  {habit.name}
                </Text>
                <Text style={[
                  styles.habitGoal,
                  { color: habit.isCompleted ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)' }
                ]}>
                  {habit.goal}
                </Text>
                
                {/* Growth Progress */}
                <View style={styles.growthIndicator}>
                  <Text style={styles.growthEmoji}>
                    {getGrowthEmoji(habit.growthStage)}
                  </Text>
                  <Text style={[
                    styles.streakText,
                    { color: getStreakColor(habit.streak) }
                  ]}>
                    {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Section - Checkbox */}
            <View style={styles.rightSection}>
              <Animated.View style={[
                styles.checkbox,
                {
                  backgroundColor: completionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', biomeTheme.accentColor],
                  }),
                  borderColor: habit.isCompleted 
                    ? biomeTheme.accentColor 
                    : 'rgba(255, 255, 255, 0.3)',
                  transform: [{
                    scale: completionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    })
                  }]
                }
              ]}>
                <Animated.Text style={[
                  styles.checkmark,
                  {
                    opacity: completionAnim,
                    transform: [{
                      scale: completionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }]
                  }
                ]}>
                  ✓
                </Animated.Text>
              </Animated.View>
            </View>
          </View>

          {/* Streak Badge */}
          {habit.streak >= 7 && (
            <View style={styles.streakBadgeContainer}>
              <LinearGradient
                colors={[getStreakColor(habit.streak), getStreakColor(habit.streak) + '80']}
                style={styles.streakBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.streakBadgeText}>
                  {getStreakBadgeText(habit.streak)}
                </Text>
              </LinearGradient>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  habitIcon: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitGoal: {
    fontSize: 14,
    marginBottom: 8,
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  streakBadgeContainer: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});