import { Habit, HabitData, QRCodeData, HabitShareData, CollectionShareData } from '../types';
import { QR_CODE_VERSION, APP_IDENTIFIER } from './qrValidation';

/**
 * Utility functions for converting between internal habit format and shareable format
 */
export class HabitConverter {
  /**
   * Converts a full Habit object to shareable HabitData (removes personal info)
   */
  static toShareableHabit(habit: Habit): HabitData {
    return {
      name: habit.name,
      icon: habit.icon,
      goal: habit.goal,
      timeOfDay: habit.timeOfDay,
      repeatCycle: habit.repeatCycle,
    };
  }

  /**
   * Converts multiple habits to shareable format
   */
  static toShareableHabits(habits: Habit[]): HabitData[] {
    return habits.map(habit => this.toShareableHabit(habit));
  }

  /**
   * Creates a complete QR code data structure for a single habit
   */
  static createHabitQRData(habit: Habit): QRCodeData {
    const habitData: HabitShareData = {
      type: 'habit',
      habit: this.toShareableHabit(habit),
      version: QR_CODE_VERSION,
    };

    return {
      app: APP_IDENTIFIER,
      version: QR_CODE_VERSION,
      type: 'habit',
      timestamp: Date.now(),
      data: habitData,
    };
  }

  /**
   * Creates a complete QR code data structure for a habit collection
   */
  static createCollectionQRData(
    name: string,
    habits: Habit[],
    description?: string
  ): QRCodeData {
    const collectionData: CollectionShareData = {
      type: 'collection',
      name: name.trim(),
      description: description?.trim(),
      habits: this.toShareableHabits(habits),
      version: QR_CODE_VERSION,
    };

    return {
      app: APP_IDENTIFIER,
      version: QR_CODE_VERSION,
      type: 'collection',
      timestamp: Date.now(),
      data: collectionData,
    };
  }

  /**
   * Converts shareable HabitData back to a new Habit object
   */
  static fromShareableHabit(habitData: HabitData): Omit<Habit, 'id' | 'createdAt' | 'streak' | 'totalXP' | 'isCompleted' | 'growthStage'> {
    return {
      name: habitData.name,
      icon: habitData.icon,
      goal: habitData.goal,
      timeOfDay: habitData.timeOfDay,
      repeatCycle: habitData.repeatCycle,
    };
  }

  /**
   * Converts multiple shareable habits back to new Habit objects
   */
  static fromShareableHabits(habitsData: HabitData[]): Omit<Habit, 'id' | 'createdAt' | 'streak' | 'totalXP' | 'isCompleted' | 'growthStage'>[] {
    return habitsData.map(habitData => this.fromShareableHabit(habitData));
  }

  /**
   * Generates a unique variant name for conflicting habits
   */
  static generateVariantName(originalName: string, existingNames: string[]): string {
    let counter = 1;
    let variantName = `${originalName} (${counter})`;
    
    while (existingNames.includes(variantName)) {
      counter++;
      variantName = `${originalName} (${counter})`;
    }
    
    return variantName;
  }

  /**
   * Detects potential conflicts between new and existing habits
   */
  static detectNameConflicts(newHabits: HabitData[], existingHabits: Habit[]): string[] {
    const existingNames = existingHabits.map(h => h.name.toLowerCase());
    const conflicts: string[] = [];

    newHabits.forEach(newHabit => {
      if (existingNames.includes(newHabit.name.toLowerCase())) {
        conflicts.push(newHabit.name);
      }
    });

    return conflicts;
  }

  /**
   * Checks if two habits are essentially the same (exact match)
   */
  static areHabitsIdentical(habit1: HabitData, habit2: Habit): boolean {
    return (
      habit1.name.toLowerCase() === habit2.name.toLowerCase() &&
      habit1.goal.toLowerCase() === habit2.goal.toLowerCase() &&
      habit1.timeOfDay === habit2.timeOfDay &&
      habit1.repeatCycle === habit2.repeatCycle
    );
  }

  /**
   * Checks if two habits have similar goals (for conflict detection)
   */
  static haveSimilarGoals(habit1: HabitData, habit2: Habit): boolean {
    const goal1 = habit1.goal.toLowerCase().replace(/[^\w\s]/g, '');
    const goal2 = habit2.goal.toLowerCase().replace(/[^\w\s]/g, '');
    
    // Simple similarity check - can be enhanced with more sophisticated algorithms
    const words1 = goal1.split(/\s+/);
    const words2 = goal2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      word.length > 3 && words2.includes(word)
    );
    
    return commonWords.length >= 2 || (commonWords.length >= 1 && Math.min(words1.length, words2.length) <= 3);
  }
}

/**
 * Helper function to create a JSON string for QR code generation
 */
export function createQRCodeString(qrData: QRCodeData): string {
  return JSON.stringify(qrData);
}

/**
 * Helper function to parse QR code string back to data
 */
export function parseQRCodeString(qrString: string): QRCodeData {
  return JSON.parse(qrString);
}