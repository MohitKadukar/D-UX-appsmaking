import { BiomeTheme, BiomeType } from '../types';

export const BIOMES: Record<BiomeType, BiomeTheme> = {
  forest: {
    name: 'Forest',
    backgroundColor: '#2d5016',
    primaryColor: '#4a7c59',
    secondaryColor: '#8fbc8f',
    accentColor: '#90ee90',
    blockTexture: 'grass',
    sounds: {
      complete: 'forest_complete',
      levelUp: 'forest_levelup',
      notification: 'forest_notify'
    }
  },
  desert: {
    name: 'Desert',
    backgroundColor: '#c2b280',
    primaryColor: '#daa520',
    secondaryColor: '#f4a460',
    accentColor: '#ffd700',
    blockTexture: 'sand',
    sounds: {
      complete: 'desert_complete',
      levelUp: 'desert_levelup',
      notification: 'desert_notify'
    }
  },
  snowy: {
    name: 'Snowy Tundra',
    backgroundColor: '#e6f3ff',
    primaryColor: '#87ceeb',
    secondaryColor: '#b0e0e6',
    accentColor: '#00bfff',
    blockTexture: 'snow',
    sounds: {
      complete: 'snow_complete',
      levelUp: 'snow_levelup',
      notification: 'snow_notify'
    }
  },
  ocean: {
    name: 'Ocean',
    backgroundColor: '#006994',
    primaryColor: '#4682b4',
    secondaryColor: '#5f9ea0',
    accentColor: '#00ced1',
    blockTexture: 'water',
    sounds: {
      complete: 'ocean_complete',
      levelUp: 'ocean_levelup',
      notification: 'ocean_notify'
    }
  },
  nether: {
    name: 'Nether',
    backgroundColor: '#8b0000',
    primaryColor: '#dc143c',
    secondaryColor: '#ff6347',
    accentColor: '#ff4500',
    blockTexture: 'netherrack',
    sounds: {
      complete: 'nether_complete',
      levelUp: 'nether_levelup',
      notification: 'nether_notify'
    }
  },
  end: {
    name: 'The End',
    backgroundColor: '#2f1b69',
    primaryColor: '#483d8b',
    secondaryColor: '#6a5acd',
    accentColor: '#9370db',
    blockTexture: 'endstone',
    sounds: {
      complete: 'end_complete',
      levelUp: 'end_levelup',
      notification: 'end_notify'
    }
  }
};

export const HABIT_ICONS = {
  water: '🪣', // bucket
  exercise: '⚔️', // sword
  reading: '📚', // book
  meditation: '🧘', // zen
  sleep: '🛏️', // bed
  coding: '⛏️', // pickaxe
  cooking: '🍳', // cooking
  cleaning: '🧹', // broom
  walking: '👟', // boots
  journaling: '✍️' // writing
};

export const XP_PER_HABIT = 10;
export const STREAK_BONUS_MULTIPLIER = 1.5;
export const LEVEL_XP_REQUIREMENT = 100;