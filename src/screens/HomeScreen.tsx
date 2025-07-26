import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { completeHabit, uncompleteHabit } from '../store/slices/habitsSlice';
import { addXP, updatePetHappiness } from '../store/slices/userSlice';
import { BIOMES, XP_PER_HABIT } from '../constants/biomes';
import HabitCard from '../components/HabitCard';
import PetWidget from '../components/PetWidget';
import XPBar from '../components/XPBar';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.user.user);
  const habits = useSelector((state: RootState) => state.habits.habits);
  const currentBiome = user?.currentBiome || 'forest';
  const biomeTheme = BIOMES[currentBiome];

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [refreshing, setRefreshing] = useState(false);

  const completedToday = habits.filter(h => h.isCompleted).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

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
    ]).start();
  }, []);

  const handleHabitToggle = (habitId: string, isCompleted: boolean) => {
    if (isCompleted) {
      dispatch(uncompleteHabit(habitId));
    } else {
      dispatch(completeHabit(habitId));
      dispatch(addXP(XP_PER_HABIT));
      dispatch(updatePetHappiness(user?.pet.happiness || 0 + 10));
      
      // Celebration animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (progressPercentage === 100) return "Perfect day! You're unstoppable! 🔥";
    if (progressPercentage >= 75) return "Almost there! Keep going! 💪";
    if (progressPercentage >= 50) return "Great progress today! 🌟";
    if (progressPercentage >= 25) return "You're building momentum! ⚡";
    return "Every journey starts with a single step 🌱";
  };

  return (
    <LinearGradient
      colors={[biomeTheme.backgroundColor, biomeTheme.primaryColor, biomeTheme.backgroundColor]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={biomeTheme.backgroundColor} />
      
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
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.username}! 👋
            </Text>
            <Text style={styles.biomeText}>
              {biomeTheme.name} • Level {user?.level || 1}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings' as never)}
          >
            <LinearGradient
              colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Daily Progress Card */}
          <View style={styles.progressSection}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.progressCard}
            >
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Today's Journey</Text>
                <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
              </View>
              
              <Text style={styles.motivationalText}>
                {getMotivationalMessage()}
              </Text>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${progressPercentage}%`,
                        backgroundColor: biomeTheme.accentColor 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedToday} of {totalHabits} habits completed
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* XP Bar */}
          <XPBar />

          {/* Pet Widget */}
          <PetWidget />

          {/* Habits Section */}
          <View style={styles.habitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Habits</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddHabit' as never)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {habits.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIllustration}>
                  <Text style={styles.emptyEmoji}>🌱</Text>
                </View>
                <Text style={styles.emptyTitle}>Start Your Journey</Text>
                <Text style={styles.emptyText}>
                  Create your first habit and begin building a better you, one block at a time.
                </Text>
                <TouchableOpacity
                  style={styles.createFirstButton}
                  onPress={() => navigation.navigate('AddHabit' as never)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
                    style={styles.createFirstGradient}
                  >
                    <Text style={styles.createFirstText}>Create Your First Habit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.habitsList}>
                {habits.map((habit, index) => (
                  <Animated.View
                    key={habit.id}
                    style={[
                      styles.habitCardWrapper,
                      {
                        transform: [{
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 30],
                            outputRange: [0, 30 + (index * 10)],
                          })
                        }]
                      }
                    ]}
                  >
                    <HabitCard
                      habit={habit}
                      onToggle={handleHabitToggle}
                      biomeTheme={biomeTheme}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
    paddingTop: 50,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  biomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  
  // Progress Section
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  motivationalText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    fontWeight: '500',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  
  // Habits Section
  habitsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createFirstGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createFirstText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Habits List
  habitsList: {
    gap: 16,
  },
  habitCardWrapper: {
    marginBottom: 4,
  },
});