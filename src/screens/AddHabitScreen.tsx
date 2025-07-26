import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { addHabit } from '../store/slices/habitsSlice';
import { BIOMES, HABIT_ICONS } from '../constants/biomes';

const { width } = Dimensions.get('window');

export default function AddHabitScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.user.user);
  const currentBiome = user?.currentBiome || 'forest';
  const biomeTheme = BIOMES[currentBiome];

  // Headspace-style gentle animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [habitName, setHabitName] = useState('');
  const [habitGoal, setHabitGoal] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🪣');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime');
  const [repeatCycle, setRepeatCycle] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    // Gentle entrance animation
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

  const handleCreateHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Mindful Reminder', 'What would you like to call this habit?', [
        { text: 'Let me think', style: 'default' }
      ]);
      return;
    }
    if (!habitGoal.trim()) {
      Alert.alert('Set Your Intention', 'What goal would you like to achieve?', [
        { text: 'I\'ll add one', style: 'default' }
      ]);
      return;
    }

    dispatch(addHabit({
      name: habitName.trim(),
      goal: habitGoal.trim(),
      icon: selectedIcon,
      timeOfDay,
      repeatCycle,
    }));

    Alert.alert(
      '🌱 Beautiful!',
      'Your new habit has been planted. Watch it grow with your daily practice.',
      [
        {
          text: 'Continue Journey',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const iconOptions = Object.entries(HABIT_ICONS);
  const timeOptions = [
    { value: 'morning', label: 'Morning', emoji: '🌅', desc: 'Start fresh' },
    { value: 'afternoon', label: 'Afternoon', emoji: '☀️', desc: 'Midday boost' },
    { value: 'evening', label: 'Evening', emoji: '🌙', desc: 'Wind down' },
    { value: 'anytime', label: 'Anytime', emoji: '⏰', desc: 'Flexible' },
  ];

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
        {/* Header - Headspace zen style */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.backButtonGradient}
            >
              <Text style={styles.backButtonText}>←</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create a New Habit</Text>
            <Text style={styles.subtitle}>
              Small steps lead to big changes 🌱
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Habit Name - Mindful input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What habit would you like to build?</Text>
            <LinearGradient
              colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)']}
              style={styles.inputCard}
            >
              <TextInput
                style={styles.input}
                value={habitName}
                onChangeText={setHabitName}
                placeholder="e.g., Drink more water, Read daily, Meditate"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                maxLength={50}
                autoCapitalize="sentences"
              />
            </LinearGradient>
          </View>

          {/* Goal - Intention setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Set your intention</Text>
            <LinearGradient
              colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)']}
              style={styles.inputCard}
            >
              <TextInput
                style={styles.input}
                value={habitGoal}
                onChangeText={setHabitGoal}
                placeholder="e.g., 8 glasses daily, 20 minutes, 10 pages"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                maxLength={100}
                autoCapitalize="sentences"
              />
            </LinearGradient>
          </View>

          {/* Icon Selection - Playful but zen */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose your symbol</Text>
            <View style={styles.iconGrid}>
              {iconOptions.map(([key, icon]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: selectedIcon === icon 
                        ? biomeTheme.accentColor + '40'
                        : 'rgba(255, 255, 255, 0.1)',
                      borderColor: selectedIcon === icon 
                        ? biomeTheme.accentColor 
                        : 'transparent',
                    }
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time of Day - Mindful timing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When feels right?</Text>
            <View style={styles.timeGrid}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor: timeOfDay === option.value 
                        ? biomeTheme.accentColor + '20'
                        : 'rgba(255, 255, 255, 0.08)',
                      borderColor: timeOfDay === option.value 
                        ? biomeTheme.accentColor 
                        : 'transparent',
                    }
                  ]}
                  onPress={() => setTimeOfDay(option.value as any)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.timeEmoji}>{option.emoji}</Text>
                  <Text style={styles.timeLabel}>{option.label}</Text>
                  <Text style={styles.timeDesc}>{option.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frequency - Gentle commitment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How often?</Text>
            <View style={styles.frequencyGrid}>
              <TouchableOpacity
                style={[
                  styles.frequencyOption,
                  {
                    backgroundColor: repeatCycle === 'daily' 
                      ? biomeTheme.accentColor + '20'
                      : 'rgba(255, 255, 255, 0.08)',
                    borderColor: repeatCycle === 'daily' 
                      ? biomeTheme.accentColor 
                      : 'transparent',
                  }
                ]}
                onPress={() => setRepeatCycle('daily')}
                activeOpacity={0.8}
              >
                <Text style={styles.frequencyEmoji}>📅</Text>
                <Text style={styles.frequencyLabel}>Daily</Text>
                <Text style={styles.frequencyDesc}>Build consistency</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyOption,
                  {
                    backgroundColor: repeatCycle === 'weekly' 
                      ? biomeTheme.accentColor + '20'
                      : 'rgba(255, 255, 255, 0.08)',
                    borderColor: repeatCycle === 'weekly' 
                      ? biomeTheme.accentColor 
                      : 'transparent',
                  }
                ]}
                onPress={() => setRepeatCycle('weekly')}
                activeOpacity={0.8}
              >
                <Text style={styles.frequencyEmoji}>📆</Text>
                <Text style={styles.frequencyLabel}>Weekly</Text>
                <Text style={styles.frequencyDesc}>Gentle pace</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Button - Mindful CTA */}
          <TouchableOpacity
            style={[
              styles.createButton,
              { 
                opacity: habitName.trim() && habitGoal.trim() ? 1 : 0.6 
              }
            ]}
            onPress={handleCreateHabit}
            disabled={!habitName.trim() || !habitGoal.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[biomeTheme.accentColor, biomeTheme.primaryColor]}
              style={styles.createButtonGradient}
            >
              <Text style={styles.createButtonText}>Plant This Habit 🌱</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  
  // Header - Headspace zen style
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  
  // Sections - Mindful spacing
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  
  // Input Cards - Headspace soft design
  inputCard: {
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    backgroundColor: 'transparent',
    padding: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  // Icon Grid - Playful but zen
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 28,
  },
  
  // Time Grid - Mindful timing
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeOption: {
    flex: 1,
    minWidth: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  timeDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  
  // Frequency Grid - Gentle commitment
  frequencyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  frequencyEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  frequencyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  frequencyDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Create Button - Mindful CTA
  createButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  createButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});