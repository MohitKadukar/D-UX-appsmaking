import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BIOMES, LEVEL_XP_REQUIREMENT } from '../constants/biomes';
import XPBar from '../components/XPBar';

export default function ProgressScreen() {
  const user = useSelector((state: RootState) => state.user.user);
  const habits = useSelector((state: RootState) => state.habits.habits);
  
  if (!user) return null;

  const currentBiome = user.currentBiome;
  const biomeTheme = BIOMES[currentBiome];

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.isCompleted).length;
  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalHabitXP = habits.reduce((sum, h) => sum + h.totalXP, 0);

  // Achievement data
  const achievements = [
    {
      id: 'first_habit',
      title: 'First Steps',
      description: 'Create your first habit',
      icon: '🌱',
      unlocked: totalHabits >= 1,
      progress: Math.min(totalHabits, 1),
      target: 1,
    },
    {
      id: 'habit_master',
      title: 'Habit Master',
      description: 'Create 5 habits',
      icon: '⚒️',
      unlocked: totalHabits >= 5,
      progress: Math.min(totalHabits, 5),
      target: 5,
    },
    {
      id: 'streak_starter',
      title: 'Streak Starter',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: longestStreak >= 7,
      progress: Math.min(longestStreak, 7),
      target: 7,
    },
    {
      id: 'streak_legend',
      title: 'Streak Legend',
      description: 'Maintain a 30-day streak',
      icon: '🏆',
      unlocked: longestStreak >= 30,
      progress: Math.min(longestStreak, 30),
      target: 30,
    },
    {
      id: 'xp_collector',
      title: 'XP Collector',
      description: 'Earn 1000 total XP',
      icon: '💎',
      unlocked: user.totalXP >= 1000,
      progress: Math.min(user.totalXP, 1000),
      target: 1000,
    },
  ];

  const unlockedBiomes = user.unlockedBiomes;
  const lockedBiomes = Object.keys(BIOMES).filter(biome => !unlockedBiomes.includes(biome as any));

  return (
    <ImageBackground
      source={{ uri: `https://via.placeholder.com/400x800/${biomeTheme.backgroundColor.slice(1)}/ffffff?text=🏔️` }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: biomeTheme.accentColor }]}>
          Progress & Achievements
        </Text>

        {/* XP Progress */}
        <XPBar />

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: biomeTheme.primaryColor }]}>
            <Text style={styles.statNumber}>{user.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: biomeTheme.primaryColor }]}>
            <Text style={styles.statNumber}>{user.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: biomeTheme.primaryColor }]}>
            <Text style={styles.statNumber}>{totalHabits}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: biomeTheme.primaryColor }]}>
            <Text style={styles.statNumber}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Today's Progress */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <Text style={styles.progressText}>
            {completedToday} / {totalHabits} habits completed
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%`,
                  backgroundColor: biomeTheme.accentColor 
                }
              ]} 
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Achievements</Text>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <Text style={[
                styles.achievementIcon,
                { opacity: achievement.unlocked ? 1 : 0.3 }
              ]}>
                {achievement.icon}
              </Text>
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  { color: achievement.unlocked ? '#fff' : '#888' }
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDesc,
                  { color: achievement.unlocked ? '#ddd' : '#666' }
                ]}>
                  {achievement.description}
                </Text>
                <View style={styles.achievementProgress}>
                  <View style={styles.achievementProgressBar}>
                    <View 
                      style={[
                        styles.achievementProgressFill,
                        { 
                          width: `${(achievement.progress / achievement.target) * 100}%`,
                          backgroundColor: achievement.unlocked ? biomeTheme.accentColor : '#666'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.achievementProgressText}>
                    {achievement.progress}/{achievement.target}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Unlocked Biomes */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Unlocked Worlds</Text>
          <View style={styles.biomeGrid}>
            {unlockedBiomes.map((biome) => (
              <View key={biome} style={[styles.biomeItem, { backgroundColor: BIOMES[biome].backgroundColor }]}>
                <Text style={[styles.biomeName, { color: BIOMES[biome].accentColor }]}>
                  {BIOMES[biome].name}
                </Text>
              </View>
            ))}
          </View>
          
          {lockedBiomes.length > 0 && (
            <>
              <Text style={[styles.cardTitle, { marginTop: 20, fontSize: 16 }]}>
                Locked Worlds
              </Text>
              <View style={styles.biomeGrid}>
                {lockedBiomes.map((biome) => (
                  <View key={biome} style={[styles.biomeItem, styles.lockedBiome]}>
                    <Text style={styles.lockedBiomeName}>
                      🔒 {BIOMES[biome as keyof typeof BIOMES].name}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Minecraft',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Minecraft',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Minecraft',
    color: '#ddd',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Minecraft',
    color: '#fff',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Minecraft',
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Minecraft',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: 'Minecraft',
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 10,
    fontFamily: 'Minecraft',
    color: '#ddd',
    width: 40,
  },
  biomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  biomeItem: {
    padding: 10,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  biomeName: {
    fontSize: 14,
    fontFamily: 'Minecraft',
  },
  lockedBiome: {
    backgroundColor: '#333',
  },
  lockedBiomeName: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    color: '#888',
  },
});