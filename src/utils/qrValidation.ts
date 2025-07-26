import { QRCodeData, HabitShareData, CollectionShareData, HabitData } from '../types';

// Current app version for QR code compatibility
export const QR_CODE_VERSION = '1.0';
export const APP_IDENTIFIER = 'blockhabits';

// Validation functions for QR code data
export class QRValidation {
  /**
   * Validates the basic structure of QR code data
   */
  static validateQRCodeData(data: any): data is QRCodeData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields
    if (data.app !== APP_IDENTIFIER) {
      return false;
    }

    if (!data.version || typeof data.version !== 'string') {
      return false;
    }

    if (!data.type || !['habit', 'collection'].includes(data.type)) {
      return false;
    }

    if (!data.timestamp || typeof data.timestamp !== 'number') {
      return false;
    }

    if (!data.data || typeof data.data !== 'object') {
      return false;
    }

    // Validate specific data type
    if (data.type === 'habit') {
      return this.validateHabitShareData(data.data);
    } else if (data.type === 'collection') {
      return this.validateCollectionShareData(data.data);
    }

    return false;
  }

  /**
   * Validates habit share data structure
   */
  static validateHabitShareData(data: any): data is HabitShareData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (data.type !== 'habit') {
      return false;
    }

    if (!data.version || typeof data.version !== 'string') {
      return false;
    }

    if (!data.habit || typeof data.habit !== 'object') {
      return false;
    }

    return this.validateHabitData(data.habit);
  }

  /**
   * Validates collection share data structure
   */
  static validateCollectionShareData(data: any): data is CollectionShareData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (data.type !== 'collection') {
      return false;
    }

    if (!data.version || typeof data.version !== 'string') {
      return false;
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return false;
    }

    if (data.description && typeof data.description !== 'string') {
      return false;
    }

    if (!Array.isArray(data.habits) || data.habits.length === 0) {
      return false;
    }

    // Validate each habit in the collection
    return data.habits.every((habit: any) => this.validateHabitData(habit));
  }

  /**
   * Validates individual habit data structure
   */
  static validateHabitData(data: any): data is HabitData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Required string fields
    const requiredStringFields = ['name', 'icon', 'goal'];
    for (const field of requiredStringFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length === 0) {
        return false;
      }
    }

    // Validate timeOfDay enum
    const validTimeOfDay = ['morning', 'afternoon', 'evening', 'anytime'];
    if (!data.timeOfDay || !validTimeOfDay.includes(data.timeOfDay)) {
      return false;
    }

    // Validate repeatCycle enum
    const validRepeatCycle = ['daily', 'weekly'];
    if (!data.repeatCycle || !validRepeatCycle.includes(data.repeatCycle)) {
      return false;
    }

    return true;
  }

  /**
   * Sanitizes habit data to ensure it doesn't contain personal information
   */
  static sanitizeHabitData(habit: any): HabitData {
    return {
      name: String(habit.name || '').trim(),
      icon: String(habit.icon || '').trim(),
      goal: String(habit.goal || '').trim(),
      timeOfDay: habit.timeOfDay || 'anytime',
      repeatCycle: habit.repeatCycle || 'daily',
    };
  }

  /**
   * Checks if QR code data is from a compatible version
   */
  static isCompatibleVersion(version: string): boolean {
    // For now, we only support version 1.0
    // In the future, this could handle backward compatibility
    return version === QR_CODE_VERSION;
  }

  /**
   * Validates QR code size limits to prevent abuse
   */
  static validateDataSize(data: QRCodeData): boolean {
    const jsonString = JSON.stringify(data);
    const maxSize = 2048; // 2KB limit for QR codes
    
    if (jsonString.length > maxSize) {
      return false;
    }

    // Additional limits for collections
    if (data.type === 'collection' && data.data.type === 'collection') {
      const maxHabitsInCollection = 10;
      if (data.data.habits.length > maxHabitsInCollection) {
        return false;
      }
    }

    return true;
  }
}

// Error types for validation failures
export enum QRValidationError {
  INVALID_FORMAT = 'INVALID_FORMAT',
  INCOMPATIBLE_VERSION = 'INCOMPATIBLE_VERSION',
  INVALID_APP = 'INVALID_APP',
  DATA_TOO_LARGE = 'DATA_TOO_LARGE',
  INVALID_HABIT_DATA = 'INVALID_HABIT_DATA',
  INVALID_COLLECTION_DATA = 'INVALID_COLLECTION_DATA',
}

export interface ValidationResult {
  isValid: boolean;
  error?: QRValidationError;
  message?: string;
}

/**
 * Comprehensive validation function that returns detailed results
 */
export function validateQRCode(rawData: string): ValidationResult {
  try {
    const data = JSON.parse(rawData);
    
    if (!QRValidation.validateQRCodeData(data)) {
      return {
        isValid: false,
        error: QRValidationError.INVALID_FORMAT,
        message: 'QR code format is not valid'
      };
    }

    if (!QRValidation.isCompatibleVersion(data.version)) {
      return {
        isValid: false,
        error: QRValidationError.INCOMPATIBLE_VERSION,
        message: 'This QR code was created with an incompatible version'
      };
    }

    if (!QRValidation.validateDataSize(data)) {
      return {
        isValid: false,
        error: QRValidationError.DATA_TOO_LARGE,
        message: 'QR code contains too much data'
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: QRValidationError.INVALID_FORMAT,
      message: 'QR code could not be parsed'
    };
  }
}