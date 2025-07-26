# Technology Stack

## Current Stack - React Native with Expo

**Frontend**: React Native with Expo
**State Management**: Redux Toolkit
**Navigation**: React Navigation v6
**Storage**: AsyncStorage for local data persistence
**Animations**: React Native Reanimated
**UI Components**: Custom pixel-art styled components
**Audio**: Expo AV for sound effects
**Fonts**: Custom Minecraft font loading
**Icons**: Expo Vector Icons

## Key Dependencies
- `@reduxjs/toolkit` - State management
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `react-redux` - Redux bindings
- `expo-font` - Custom font loading
- `expo-av` - Audio/video functionality
- `expo-notifications` - Push notifications
- `react-native-reanimated` - Animations

## Common Development Commands
```bash
# Development
npm start                 # Start Expo development server
npm run android          # Run on Android device/emulator
npm run ios             # Run on iOS device/simulator
npm run web             # Run in web browser

# Build & Deploy
expo build:android      # Build Android APK
expo build:ios         # Build iOS IPA
expo publish           # Publish to Expo

# Testing & Quality
npm test               # Run Jest tests
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript checks
```

## Architecture Patterns
- **Redux Toolkit**: Centralized state management with slices
- **Component-based**: Reusable UI components with consistent theming
- **Screen-based navigation**: Stack and tab navigation patterns
- **Theme system**: Biome-based dynamic theming
- **Custom hooks**: Reusable logic extraction

## Development Standards
- TypeScript for type safety
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Minecraft-inspired UI design patterns
- Responsive design for different screen sizes
- Performance optimization for smooth animations