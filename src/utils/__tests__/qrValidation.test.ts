import { QRValidation, validateQRCode, QRValidationError } from '../qrValidation';
import { QRCodeData, HabitData, HabitShareData, CollectionShareData } from '../../types';

describe('QRValidation', () => {
  const validHabitData: HabitData = {
    name: 'Morning Exercise',
    icon: '🏃',
    goal: 'Run for 30 minutes',
    timeOfDay: 'morning',
    repeatCycle: 'daily',
  };

  const validHabitShareData: HabitShareData = {
    type: 'habit',
    habit: validHabitData,
    version: '1.0',
  };

  const validCollectionShareData: CollectionShareData = {
    type: 'collection',
    name: 'Morning Routine',
    description: 'Start your day right',
    habits: [validHabitData],
    version: '1.0',
  };

  const validQRCodeData: QRCodeData = {
    app: 'blockhabits',
    version: '1.0',
    type: 'habit',
    timestamp: Date.now(),
    data: validHabitShareData,
  };

  describe('validateHabitData', () => {
    it('should validate correct habit data', () => {
      expect(QRValidation.validateHabitData(validHabitData)).toBe(true);
    });

    it('should reject habit data with missing name', () => {
      const invalidData = { ...validHabitData, name: '' };
      expect(QRValidation.validateHabitData(invalidData)).toBe(false);
    });

    it('should reject habit data with invalid timeOfDay', () => {
      const invalidData = { ...validHabitData, timeOfDay: 'invalid' };
      expect(QRValidation.validateHabitData(invalidData)).toBe(false);
    });

    it('should reject habit data with invalid repeatCycle', () => {
      const invalidData = { ...validHabitData, repeatCycle: 'invalid' };
      expect(QRValidation.validateHabitData(invalidData)).toBe(false);
    });
  });

  describe('validateHabitShareData', () => {
    it('should validate correct habit share data', () => {
      expect(QRValidation.validateHabitShareData(validHabitShareData)).toBe(true);
    });

    it('should reject data with wrong type', () => {
      const invalidData = { ...validHabitShareData, type: 'collection' };
      expect(QRValidation.validateHabitShareData(invalidData)).toBe(false);
    });

    it('should reject data with invalid habit', () => {
      const invalidData = { ...validHabitShareData, habit: { name: '' } };
      expect(QRValidation.validateHabitShareData(invalidData)).toBe(false);
    });
  });

  describe('validateCollectionShareData', () => {
    it('should validate correct collection share data', () => {
      expect(QRValidation.validateCollectionShareData(validCollectionShareData)).toBe(true);
    });

    it('should reject data with empty name', () => {
      const invalidData = { ...validCollectionShareData, name: '' };
      expect(QRValidation.validateCollectionShareData(invalidData)).toBe(false);
    });

    it('should reject data with empty habits array', () => {
      const invalidData = { ...validCollectionShareData, habits: [] };
      expect(QRValidation.validateCollectionShareData(invalidData)).toBe(false);
    });

    it('should reject data with invalid habits', () => {
      const invalidData = { 
        ...validCollectionShareData, 
        habits: [{ name: '' }] 
      };
      expect(QRValidation.validateCollectionShareData(invalidData)).toBe(false);
    });
  });

  describe('validateQRCodeData', () => {
    it('should validate correct QR code data', () => {
      expect(QRValidation.validateQRCodeData(validQRCodeData)).toBe(true);
    });

    it('should reject data with wrong app identifier', () => {
      const invalidData = { ...validQRCodeData, app: 'wrongapp' };
      expect(QRValidation.validateQRCodeData(invalidData)).toBe(false);
    });

    it('should reject data with invalid type', () => {
      const invalidData = { ...validQRCodeData, type: 'invalid' };
      expect(QRValidation.validateQRCodeData(invalidData)).toBe(false);
    });
  });

  describe('validateQRCode', () => {
    it('should validate correct QR code string', () => {
      const qrString = JSON.stringify(validQRCodeData);
      const result = validateQRCode(qrString);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid JSON', () => {
      const result = validateQRCode('invalid json');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(QRValidationError.INVALID_FORMAT);
    });

    it('should reject incompatible version', () => {
      const invalidData = { ...validQRCodeData, version: '2.0' };
      const qrString = JSON.stringify(invalidData);
      const result = validateQRCode(qrString);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(QRValidationError.INCOMPATIBLE_VERSION);
    });
  });

  describe('sanitizeHabitData', () => {
    it('should sanitize habit data correctly', () => {
      const dirtyData = {
        name: '  Morning Exercise  ',
        icon: '🏃',
        goal: '  Run for 30 minutes  ',
        timeOfDay: 'morning',
        repeatCycle: 'daily',
        // These should be removed
        id: '123',
        streak: 5,
        totalXP: 100,
      };

      const sanitized = QRValidation.sanitizeHabitData(dirtyData);
      expect(sanitized).toEqual({
        name: 'Morning Exercise',
        icon: '🏃',
        goal: 'Run for 30 minutes',
        timeOfDay: 'morning',
        repeatCycle: 'daily',
      });
      expect(sanitized).not.toHaveProperty('id');
      expect(sanitized).not.toHaveProperty('streak');
      expect(sanitized).not.toHaveProperty('totalXP');
    });
  });
});