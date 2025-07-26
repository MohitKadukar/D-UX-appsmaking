import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BiomeType } from '../../types';

interface ThemeState {
  isDarkMode: boolean;
  currentBiome: BiomeType;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
  currentBiome: 'forest',
  soundEnabled: true,
  notificationsEnabled: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setBiome: (state, action: PayloadAction<BiomeType>) => {
      state.currentBiome = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
  },
});

export const {
  toggleDarkMode,
  setBiome,
  toggleSound,
  toggleNotifications,
} = themeSlice.actions;

export default themeSlice.reducer;