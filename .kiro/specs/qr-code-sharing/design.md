# Design Document

## Overview

The QR Code Sharing feature enables seamless sharing and discovery of habits through QR codes, integrating with the existing BlockHabits ecosystem. The feature consists of two main components: QR code generation for sharing habits/collections, and QR code scanning for discovering new content. The design maintains the Minecraft-inspired visual theme while providing a smooth, offline-capable sharing experience.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   QR Generator  │    │   QR Scanner    │    │  Share Manager  │
│                 │    │                 │    │                 │
│ - Habit Encoder │    │ - Camera View   │    │ - Data Encoder  │
│ - QR Renderer   │    │ - QR Decoder    │    │ - Validation    │
│ - Theme Styling │    │ - Preview UI    │    │ - Conflict Res. │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Redux Store    │
                    │                 │
                    │ - Habits Slice  │
                    │ - User Slice    │
                    │ - Theme Slice   │
                    └─────────────────┘
```

### Dependencies

The feature will require these new Expo/React Native packages:
- `expo-camera`: For QR code scanning functionality
- `expo-barcode-scanner`: Alternative/fallback for QR scanning
- `react-native-qrcode-svg`: For generating QR codes with custom styling
- `expo-sharing`: For native sharing capabilities

## Components and Interfaces

### 1. QR Code Generator Component

**Location**: `src/components/QRCodeGenerator.tsx`

```typescript
interface QRCodeGeneratorProps {
  data: HabitShareData | CollectionShareData;
  visible: boolean;
  onClose: () => void;
  biomeTheme: BiomeTheme;
}

interface HabitShareData {
  type: 'habit';
  habit: Habit;
  version: string; // For future compatibility
}

interface CollectionShareData {
  type: 'collection';
  name: string;
  habits: Habit[];
  version: string;
}
```

**Features**:
- Full-screen modal with biome-themed styling
- Pixel-art border design matching current biome
- QR code with custom colors based on biome theme
- Share button integration with native sharing
- Save to device option

### 2. QR Code Scanner Component

**Location**: `src/components/QRCodeScanner.tsx`

```typescript
interface QRCodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: HabitShareData | CollectionShareData) => void;
  onScanError: (error: string) => void;
}
```

**Features**:
- Camera view with scanning overlay
- Minecraft-themed scanning frame animation
- Permission handling for camera access
- Real-time QR code detection
- Error handling for invalid codes

### 3. Habit Preview Component

**Location**: `src/components/HabitPreview.tsx`

```typescript
interface HabitPreviewProps {
  data: HabitShareData | CollectionShareData;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  conflictResolution?: ConflictResolution;
}

interface ConflictResolution {
  existingHabits: Habit[];
  options: ('merge' | 'replace' | 'create_variant')[];
}
```

**Features**:
- Preview of habit(s) with biome-appropriate styling
- Conflict resolution UI for existing habits
- XP and biome information display
- Confirmation/cancellation actions

### 4. Share Manager Service

**Location**: `src/services/ShareManager.ts`

```typescript
class ShareManager {
  static encodeHabit(habit: Habit): string;
  static encodeCollection(name: string, habits: Habit[]): string;
  static decodeQRData(qrString: string): HabitShareData | CollectionShareData;
  static validateQRData(data: any): boolean;
  static detectConflicts(newHabits: Habit[], existingHabits: Habit[]): ConflictResolution;
  static resolveConflicts(resolution: ConflictResolution, choice: string): Habit[];
}
```

## Data Models

### QR Code Data Structure

The QR code will contain JSON data with the following structure:

```typescript
interface QRCodeData {
  app: 'blockhabits';
  version: '1.0';
  type: 'habit' | 'collection';
  timestamp: number;
  data: HabitData | CollectionData;
}

interface HabitData {
  name: string;
  icon: string;
  goal: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  repeatCycle: 'daily' | 'weekly';
  // Note: Excludes personal data like streak, XP, completion status
}

interface CollectionData {
  name: string;
  description?: string;
  habits: HabitData[];
}
```

### Redux State Extensions

**New slice**: `src/store/slices/sharingSlice.ts`

```typescript
interface SharingState {
  recentShares: ShareRecord[];
  scanHistory: ScanRecord[];
  preferences: {
    autoAcceptFromTrustedUsers: boolean;
    defaultConflictResolution: 'ask' | 'merge' | 'skip';
  };
}

interface ShareRecord {
  id: string;
  type: 'habit' | 'collection';
  name: string;
  sharedAt: Date;
  shareCount: number;
}

interface ScanRecord {
  id: string;
  scannedAt: Date;
  source: 'qr' | 'link';
  accepted: boolean;
}
```

## Error Handling

### QR Code Generation Errors
- **Invalid habit data**: Display user-friendly error with suggestion to refresh
- **Encoding failure**: Fallback to simplified data structure
- **Theme loading failure**: Use default biome colors

### QR Code Scanning Errors
- **Camera permission denied**: Show permission request dialog with explanation
- **Invalid QR code**: Display "This doesn't look like a BlockHabits code" message
- **Corrupted data**: Show "QR code appears damaged" with retry option
- **Version incompatibility**: Show "This habit was shared from a newer version" message

### Data Import Errors
- **Duplicate habits**: Trigger conflict resolution flow
- **Invalid habit structure**: Skip invalid habits, import valid ones
- **Storage failure**: Show retry option with offline queue

## Testing Strategy

### Unit Tests
- **ShareManager**: Test encoding/decoding, validation, conflict detection
- **QR Components**: Test rendering, prop handling, state management
- **Redux Integration**: Test action creators and reducers

### Integration Tests
- **End-to-end sharing flow**: Generate QR → Scan QR → Import habit
- **Conflict resolution**: Test all resolution strategies
- **Offline functionality**: Test without network connectivity
- **Permission handling**: Test camera permission flows

### Visual Tests
- **Theme consistency**: Verify QR codes match biome themes
- **Responsive design**: Test on different screen sizes
- **Accessibility**: Test with screen readers and high contrast

### Performance Tests
- **QR generation speed**: Ensure sub-second generation
- **Camera performance**: Test scanning responsiveness
- **Memory usage**: Monitor during extended scanning sessions

## Security Considerations

### Data Privacy
- QR codes contain only non-sensitive habit metadata
- No personal information (streaks, completion history, user data)
- No authentication tokens or user identifiers

### Input Validation
- Strict validation of scanned QR data structure
- Sanitization of habit names and descriptions
- Size limits on collection data to prevent abuse

### Offline Security
- Local validation of QR data before processing
- No external API calls required for basic functionality
- Secure local storage of scan history

## Implementation Notes

### Biome Theme Integration
- QR codes will use the current user's active biome colors
- Generator modal will feature pixel-art borders matching the biome
- Scanner overlay will use biome-appropriate colors and animations

### Performance Optimization
- QR generation will be cached for identical habit data
- Camera preview will be optimized for battery life
- Lazy loading of QR generation library

### Accessibility
- Voice announcements for successful scans
- High contrast mode support for QR codes
- Keyboard navigation for modal interfaces

### Future Extensibility
- Version field in QR data for backward compatibility
- Plugin architecture for additional share types
- Integration points for social features