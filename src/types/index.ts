export interface Habit {
  id: string;
  name: string;
  icon: string;
  goal: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  repeatCycle: 'daily' | 'weekly';
  createdAt: Date;
  streak: number;
  totalXP: number;
  lastCompleted?: Date;
  isCompleted: boolean;
  growthStage: 0 | 1 | 2 | 3; // 0=seed, 1=sprout, 2=growing, 3=mature
}

export interface User {
  id: string;
  username: string;
  totalXP: number;
  level: number;
  currentBiome: BiomeType;
  unlockedBiomes: BiomeType[];
  pet: Pet;
  joinedAt: Date;
}

export interface Pet {
  name: string;
  type: 'creeper' | 'pig' | 'chicken' | 'wolf';
  happiness: number; // 0-100
  evolutionStage: 0 | 1 | 2; // baby, teen, adult
  lastFed: Date;
}

export type BiomeType = 'forest' | 'desert' | 'snowy' | 'ocean' | 'nether' | 'end';

export interface BiomeTheme {
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  blockTexture: string;
  sounds: {
    complete: string;
    levelUp: string;
    notification: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

// QR Code Sharing Types
export interface QRCodeData {
  app: 'blockhabits';
  version: string;
  type: 'habit' | 'collection';
  timestamp: number;
  data: HabitShareData | CollectionShareData;
}

export interface HabitShareData {
  type: 'habit';
  habit: HabitData;
  version: string;
}

export interface CollectionShareData {
  type: 'collection';
  name: string;
  description?: string;
  habits: HabitData[];
  version: string;
}

export interface HabitData {
  name: string;
  icon: string;
  goal: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  repeatCycle: 'daily' | 'weekly';
  // Note: Excludes personal data like id, streak, XP, completion status, createdAt
}

export interface ShareRecord {
  id: string;
  type: 'habit' | 'collection';
  name: string;
  sharedAt: Date;
  shareCount: number;
}

export interface ScanRecord {
  id: string;
  scannedAt: Date;
  source: 'qr' | 'link';
  accepted: boolean;
  habitName?: string;
  collectionName?: string;
}

export interface ConflictResolution {
  existingHabits: Habit[];
  newHabits: HabitData[];
  conflicts: HabitConflict[];
}

export interface HabitConflict {
  existingHabit: Habit;
  newHabit: HabitData;
  conflictType: 'name_match' | 'similar_goal' | 'exact_match';
  resolutionOptions: ('merge' | 'replace' | 'create_variant' | 'skip')[];
}