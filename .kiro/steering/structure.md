# Project Structure

## BlockHabits React Native App Structure

```
/
├── .kiro/                    # Kiro AI assistant configuration
│   └── steering/            # AI guidance documents
├── assets/                  # Static assets
│   └── fonts/              # Custom fonts (Minecraft.ttf)
├── src/                    # Main source code
│   ├── components/         # Reusable UI components
│   │   ├── HabitCard.tsx   # Individual habit display
│   │   ├── PetWidget.tsx   # Pet companion display
│   │   ├── TabBarIcon.tsx  # Navigation icons
│   │   └── XPBar.tsx       # Experience progress bar
│   ├── constants/          # App constants and configuration
│   │   └── biomes.ts       # Biome themes and game constants
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx # Main navigation setup
│   ├── screens/            # Screen components
│   │   ├── AddHabitScreen.tsx    # Habit creation
│   │   ├── HomeScreen.tsx        # Main dashboard
│   │   ├── OnboardingScreen.tsx  # User setup
│   │   ├── ProgressScreen.tsx    # Stats and achievements
│   │   └── SettingsScreen.tsx    # App settings
│   ├── store/              # Redux state management
│   │   ├── slices/         # Redux Toolkit slices
│   │   │   ├── habitsSlice.ts    # Habit state management
│   │   │   ├── themeSlice.ts     # Theme/settings state
│   │   │   └── userSlice.ts      # User profile state
│   │   └── index.ts        # Store configuration
│   └── types/              # TypeScript type definitions
│       └── index.ts        # Shared interfaces
├── App.tsx                 # Root application component
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Naming Conventions
- **Components**: PascalCase (`HabitCard.tsx`)
- **Screens**: PascalCase with "Screen" suffix (`HomeScreen.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Constants**: UPPER_SNAKE_CASE (`XP_PER_HABIT`)
- **Types/Interfaces**: PascalCase (`BiomeType`, `Habit`)
- **Redux Actions**: camelCase (`addHabit`, `completeHabit`)

## Code Organization Principles
- **Screen-based architecture**: Each major app screen has its own file
- **Component reusability**: Shared UI components in dedicated folder
- **State management**: Centralized Redux store with feature-based slices
- **Type safety**: Comprehensive TypeScript interfaces
- **Theme system**: Biome-based dynamic styling
- **Constants separation**: Game mechanics and UI constants isolated
- **Navigation separation**: Dedicated navigation configuration

## File Responsibilities
- **Screens**: Handle user interactions and screen-level state
- **Components**: Reusable UI elements with props-based configuration
- **Store slices**: Manage specific feature state (habits, user, theme)
- **Constants**: Define game mechanics, themes, and static data
- **Types**: Provide TypeScript interfaces for type safety