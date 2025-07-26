import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, BiomeType } from '../../types';
import { LEVEL_XP_REQUIREMENT } from '../../constants/biomes';

interface UserState {
  user: User | null;
  isOnboarded: boolean;
}

const initialState: UserState = {
  user: null,
  isOnboarded: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<{ username: string; biome: BiomeType }>) => {
      state.user = {
        id: Date.now().toString(),
        username: action.payload.username,
        totalXP: 0,
        level: 1,
        currentBiome: action.payload.biome,
        unlockedBiomes: [action.payload.biome],
        pet: {
          name: 'Blocky',
          type: 'pig',
          happiness: 100,
          evolutionStage: 0,
          lastFed: new Date(),
        },
        joinedAt: new Date(),
      };
      state.isOnboarded = true;
    },
    
    addXP: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.totalXP += action.payload;
        
        // Check for level up
        const newLevel = Math.floor(state.user.totalXP / LEVEL_XP_REQUIREMENT) + 1;
        if (newLevel > state.user.level) {
          state.user.level = newLevel;
          
          // Unlock new biomes based on level
          if (newLevel >= 5 && !state.user.unlockedBiomes.includes('desert')) {
            state.user.unlockedBiomes.push('desert');
          }
          if (newLevel >= 10 && !state.user.unlockedBiomes.includes('snowy')) {
            state.user.unlockedBiomes.push('snowy');
          }
          if (newLevel >= 15 && !state.user.unlockedBiomes.includes('ocean')) {
            state.user.unlockedBiomes.push('ocean');
          }
          if (newLevel >= 25 && !state.user.unlockedBiomes.includes('nether')) {
            state.user.unlockedBiomes.push('nether');
          }
          if (newLevel >= 50 && !state.user.unlockedBiomes.includes('end')) {
            state.user.unlockedBiomes.push('end');
          }
        }
      }
    },
    
    changeBiome: (state, action: PayloadAction<BiomeType>) => {
      if (state.user && state.user.unlockedBiomes.includes(action.payload)) {
        state.user.currentBiome = action.payload;
      }
    },
    
    updatePetHappiness: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.pet.happiness = Math.max(0, Math.min(100, action.payload));
        state.user.pet.lastFed = new Date();
        
        // Pet evolution based on happiness and level
        if (state.user.pet.happiness >= 80 && state.user.level >= 10) {
          state.user.pet.evolutionStage = Math.min(2, state.user.pet.evolutionStage + 1);
        }
      }
    },
    
    decreasePetHappiness: (state) => {
      if (state.user) {
        state.user.pet.happiness = Math.max(0, state.user.pet.happiness - 10);
      }
    },
    
    resetOnboarding: (state) => {
      state.isOnboarded = false;
      state.user = null;
    },
  },
});

export const {
  createUser,
  addXP,
  changeBiome,
  updatePetHappiness,
  decreasePetHappiness,
  resetOnboarding,
} = userSlice.actions;

export default userSlice.reducer;