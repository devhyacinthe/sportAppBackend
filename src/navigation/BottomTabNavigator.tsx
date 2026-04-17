import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { FootballScreen } from '../screens/Football/FootballScreen';
import { NBAScreen } from '../screens/NBA/NBAScreen';
import { Colors } from '../constants';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof BottomTabParamList, { active: IoniconName; inactive: IoniconName }> = {
  Home:     { active: 'home',       inactive: 'home-outline' },
  Football: { active: 'football',   inactive: 'football-outline' },
  NBA:      { active: 'basketball', inactive: 'basketball-outline' },
};

export function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof BottomTabParamList];
          const name = focused ? icons.active : icons.inactive;
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '700' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Accueil', headerShown: false }}
      />
      <Tab.Screen
        name="Football"
        component={FootballScreen}
        options={{ title: 'Football' }}
      />
      <Tab.Screen
        name="NBA"
        component={NBAScreen}
        options={{ title: 'NBA' }}
      />
    </Tab.Navigator>
  );
}
