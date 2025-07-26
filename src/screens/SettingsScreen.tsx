import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { changeBiome, resetOnboarding } from '../store/slices/userSlice';
import { toggleSound, toggleNotifications } from '../store/slices/themeSlice';
import { BIOMES } from '../constants/biomes';
import { BiomeType } from '../types';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.user.user);
  const theme = useSelector((state: RootState) => state.theme);
  
  if (!user) return null;

  const currentBiome = user.currentBiome;
  const biomeTheme = BIOMES[currentBiome];

  const handleBiomeChange = (biome: BiomeType) => {
    if (user.unlockedBiomes.includes(biome)) {
      dispatch(changeBiome(biome));
      Alert.alert('🌍 World Changed!', `Welcome to the ${BIOMES[biome].name}!`);
    } else {
      Alert.alert('🔒 Locked', 'Level up to unlock this biome!');
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      '⚠️ Reset Progress',
      'This will delete all your habits and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => dispatch(resetOnboarding()),
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{ uri: `https://via.placeholder.com/400x800/${biomeTheme.backgroundColor.slice(1)}/ffffff?text=🏔️` }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: biomeTheme.accentColor }]}>
          World Settings
        </Text>

        {/* User Info */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Player Info</Text>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userLevel}>Level {user.level}</Text>
            <Text style={styles.userXP}>{user.totalXP} XP</Text>
          </View>
        </View>

        {/* Current Pet */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Your Pet</Text>
          <View style={styles.petInfo}>
            <Text style={styles.petEmoji}>
              {user.pet.type === 'pig' ? '🐷' : 
               user.pet.type === 'chicken' ? '🐓' : 
               user.pet.type === 'wolf' ? '🐺' : '💚'}
            </Text>
            <View>
              <Text style={styles.petName}>{user.pet.name}</Text>
              <Text style={styles.petDetails}>
                Level {user.pet.evolutionStage + 1} {user.pet.type}
              </Text>
              <Text style={styles.petDetails}>
                Happiness: {user.pet.happiness}%
              </Text>
            </View>
          </View>
        </View>

        {/* Biome Selection */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>Choose Your World</Text>
          <Text style={styles.cardSubtitle}>
            Current: {biomeTheme.name}
          </Text>
          <View style={styles.biomeGrid}>
            {Object.entries(BIOMES).map(([biomeKey, biome]) => {
              const isUnlocked = user.unlockedBiomes.includes(biomeKey as BiomeType);
              const isCurrent = currentBiome === biomeKey;
              
              return (
                <TouchableOpacity
                  key={biomeKey}
                  style={[
                    styles.biomeCard,
                    {
                      backgroundColor: biome.backgroundColor,
                      borderColor: isCurrent ? biome.accentColor : 'transparent',
                      borderWidth: isCurrent ? 3 : 1,
                      opacity: isUnlocked ? 1 : 0.5,
                    }
                  ]}
                  onPress={() => handleBiomeChange(biomeKey as BiomeType)}
                >
                  <Text style={[styles.biomeName, { color: biome.accentColor }]}>
                    {isUnlocked ? biome.name : `🔒 ${biome.name}`}
                  </Text>
                  {!isUnlocked && (
                    <Text style={styles.biomeRequirement}>
                      Level {biomeKey === 'desert' ? 5 : 
                             biomeKey === 'snowy' ? 10 :
                             biomeKey === 'ocean' ? 15 :
                             biomeKey === 'nether' ? 25 : 50} required
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* App Settings */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={theme.soundEnabled}
              onValueChange={() => dispatch(toggleSound())}
              trackColor={{ false: '#767577', true: biomeTheme.accentColor }}
              thumbColor={theme.soundEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={theme.notificationsEnabled}
              onValueChange={() => dispatch(toggleNotifications())}
              trackColor={{ false: '#767577', true: biomeTheme.accentColor }}
              thumbColor={theme.notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, { backgroundColor: '#8b0000' }]}>
          <Text style={styles.cardTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetProgress}
          >
            <Text style={styles.dangerButtonText}>Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={[styles.card, { backgroundColor: biomeTheme.primaryColor }]}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutText}>
            BlockHabits v1.0.0{'\n'}
            Build your habits, block by block!{'\n\n'}
            Inspired by Minecraft's world-building mechanics.
          </Text>
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
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    color: '#ddd',
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontFamily: 'Minecraft',
    color: '#fff',
    marginBottom: 5,
  },
  userLevel: {
    fontSize: 16,
    fontFamily: 'Minecraft',
    color: '#ddd',
    marginBottom: 2,
  },
  userXP: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    color: '#bbb',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  petName: {
    fontSize: 18,
    fontFamily: 'Minecraft',
    color: '#fff',
    marginBottom: 2,
  },
  petDetails: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    color: '#ddd',
  },
  biomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  biomeCard: {
    padding: 15,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
  },
  biomeName: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    marginBottom: 5,
  },
  biomeRequirement: {
    fontSize: 10,
    fontFamily: 'Minecraft',
    color: '#888',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Minecraft',
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontFamily: 'Minecraft',
    fontSize: 16,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Minecraft',
    color: '#ddd',
    lineHeight: 20,
  },
});