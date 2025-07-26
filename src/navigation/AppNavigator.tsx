import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Components
import TabBarIcon from '../components/TabBarIcon';
import { BIOMES } from '../constants/biomes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const currentBiome = useSelector((state: RootState) => state.user.user?.currentBiome || 'forest');
  const biomeTheme = BIOMES[currentBiome];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: biomeTheme.backgroundColor,
          borderTopColor: biomeTheme.primaryColor,
          borderTopWidth: 2,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: biomeTheme.accentColor,
        tabBarInactiveTintColor: biomeTheme.secondaryColor,
        headerStyle: {
          backgroundColor: biomeTheme.backgroundColor,
        },
        headerTintColor: biomeTheme.accentColor,
        headerTitleStyle: {
          fontFamily: 'Minecraft',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
          title: 'Block Habits',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="trending-up" color={color} size={size} />
          ),
          title: 'XP & Progress',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="settings" color={color} size={size} />
          ),
          title: 'World Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isOnboarded = useSelector((state: RootState) => state.user.isOnboarded);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="AddHabit" 
            component={AddHabitScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}