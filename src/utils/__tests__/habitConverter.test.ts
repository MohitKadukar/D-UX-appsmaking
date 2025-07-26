import { HabitConverter, createQRCodeString, parseQRCodeString } from '../habitConverter';
import { Habit, HabitData } from '../../types';

describe('HabitConverter', () => {
  const mockHabit: Habit = {
    id: '123',
    name: 'Morning Exercise',
    icon: '🏃',
    goal: 'Run for 30 minutes',
    timeOfDay: 'morning',
    repeatCycle: 'daily',
    createdAt: new Date('2024-01-01'),
    streak: 5,
    totalXP: 100,
    lastCompleted: new Date('2024-01-02'),
    isCompleted: true,
    growthStage: 1,
  };

  const expectedShareableHabit: HabitData = {
    name: 'Morning Exercise',
    icon: '🏃',
    goal: 'Run for 30 minutes',
    timeOfDay: 'morning',
    repeatCycle: 'daily',
  };

  describe('toShareableHabit', () => {
    it('should convert habit to shareable format', () => {
      const result = HabitConverter.toShareableHabit(mockHabit);
      expect(result).toEqual(expectedShareableHabit);
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('streak');
      expect(result).not.toHaveProperty('totalXP');
    });
  });

  describe('toShareableHabits', () => {
    it('should convert multiple habits to shareable format', () => {
      const habits = [mockHabit, { ...mockHabit, id: '456', name: 'Evening Reading' }];
      const result = HabitConverter.toShareableHabits(habits);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expectedShareableHabit);
      expect(result[1].name).toBe('Evening Reading');
    });
  });

  describe('createHabitQRData', () => {
    it('should create valid QR data for a habit', () => {
      const result = HabitConverter.createHabitQRData(mockHabit);
      
      expect(result.app).toBe('blockhabits');
      expect(result.version).toBe('1.0');
      expect(result.type).toBe('habit');
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.data.type).toBe('habit');
      expect(result.data.habit).toEqual(expectedShareableHabit);
    });
  });

  describe('createCollectionQRData', () => {
    it('should create valid QR data for a collection', () => {
      const result = HabitConverter.createCollectionQRData(
        'Morning Routine',
        [mockHabit],
        'Start your day right'
      );
      
      expect(result.app).toBe('blockhabits');
      expect(result.version).toBe('1.0');
      expect(result.type).toBe('collection');
      expect(result.data.type).toBe('collection');
      expect(result.data.name).toBe('Morning Routine');
      expect(result.data.description).toBe('Start your day right');
      expect(result.data.habits).toHaveLength(1);
      expect(result.data.habits[0]).toEqual(expectedShareableHabit);
    });
  });

  describe('fromShareableHabit', () => {
    it('should convert shareable habit back to habit format', () => {
      const result = HabitConverter.fromShareableHabit(expectedShareableHabit);
      
      expect(result.name).toBe('Morning Exercise');
      expect(result.icon).toBe('🏃');
      expect(result.goal).toBe('Run for 30 minutes');
      expect(result.timeOfDay).toBe('morning');
      expect(result.repeatCycle).toBe('daily');
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('streak');
    });
  });

  describe('generateVariantName', () => {
    it('should generate unique variant names', () => {
      const existingNames = ['Exercise', 'Exercise (1)', 'Exercise (3)'];
      const result = HabitConverter.generateVariantName('Exercise', existingNames);
      expect(result).toBe('Exercise (2)');
    });

    it('should start with (1) for first variant', () => {
      const existingNames = ['Exercise'];
      const result = HabitConverter.generateVariantName('Exercise', existingNames);
      expect(result).toBe('Exercise (1)');
    });
  });

  describe('detectNameConflicts', () => {
    it('should detect name conflicts', () => {
      const newHabits: HabitData[] = [
        { ...expectedShareableHabit, name: 'Morning Exercise' },
        { ...expectedShareableHabit, name: 'New Habit' },
      ];
      
      const existingHabits = [mockHabit];
      const conflicts = HabitConverter.detectNameConflicts(newHabits, existingHabits);
      
      expect(conflicts).toContain('Morning Exercise');
      expect(conflicts).not.toContain('New Habit');
    });
  });

  describe('areHabitsIdentical', () => {
    it('should identify identical habits', () => {
      const result = HabitConverter.areHabitsIdentical(expectedShareableHabit, mockHabit);
      expect(result).toBe(true);
    });

    it('should identify different habits', () => {
      const differentHabit = { ...expectedShareableHabit, goal: 'Different goal' };
      const result = HabitConverter.areHabitsIdentical(differentHabit, mockHabit);
      expect(result).toBe(false);
    });
  });

  describe('QR string functions', () => {
    it('should create and parse QR code strings', () => {
      const qrData = HabitConverter.createHabitQRData(mockHabit);
      const qrString = createQRCodeString(qrData);
      const parsedData = parseQRCodeString(qrString);
      
      expect(parsedData).toEqual(qrData);
    });
  });
});