import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '../../types';
import { XP_PER_HABIT, STREAK_BONUS_MULTIPLIER } from '../../constants/biomes';

interface HabitsState {
  habits: Habit[];
  dailyProgress: Record<string, boolean>;
}

const initialState: HabitsState = {
  habits: [],
  dailyProgress: {},
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'createdAt' | 'streak' | 'totalXP' | 'isCompleted' | 'growthStage'>>) => {
      const newHabit: Habit = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        streak: 0,
        totalXP: 0,
        isCompleted: false,
        growthStage: 0,
      };
      state.habits.push(newHabit);
    },
    
    completeHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload);
      if (habit && !habit.isCompleted) {
        habit.isCompleted = true;
        habit.lastCompleted = new Date();
        habit.streak += 1;
        
        // Calculate XP with streak bonus
        const baseXP = XP_PER_HABIT;
        const streakBonus = habit.streak > 7 ? baseXP * STREAK_BONUS_MULTIPLIER : baseXP;
        habit.totalXP += Math.floor(streakBonus);
        
        // Update growth stage based on streak
        if (habit.streak >= 21) habit.growthStage = 3; // mature
        else if (habit.streak >= 14) habit.growthStage = 2; // growing
        else if (habit.streak >= 7) habit.growthStage = 1; // sprout
        
        state.dailyProgress[habit.id] = true;
      }
    },
    
    uncompleteHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload);
      if (habit && habit.isCompleted) {
        habit.isCompleted = false;
        habit.streak = Math.max(0, habit.streak - 1);
        
        // Recalculate growth stage
        if (habit.streak >= 21) habit.growthStage = 3;
        else if (habit.streak >= 14) habit.growthStage = 2;
        else if (habit.streak >= 7) habit.growthStage = 1;
        else habit.growthStage = 0;
        
        state.dailyProgress[habit.id] = false;
      }
    },
    
    resetDailyProgress: (state) => {
      state.habits.forEach(habit => {
        if (!habit.isCompleted) {
          // Break streak if habit wasn't completed yesterday
          habit.streak = 0;
          habit.growthStage = 0;
        }
        habit.isCompleted = false;
      });
      state.dailyProgress = {};
    },
    
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
      delete state.dailyProgress[action.payload];
    },
    
    updateHabit: (state, action: PayloadAction<Partial<Habit> & { id: string }>) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...action.payload };
      }
    },
  },
});

export const {
  addHabit,
  completeHabit,
  uncompleteHabit,
  resetDailyProgress,
  deleteHabit,
  updateHabit,
} = habitsSlice.actions;

export default habitsSlice.reducer;