import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MatchDetailScreen } from '../screens/Football/MatchDetailScreen';
import { LeagueMatchesScreen } from '../screens/Football/LeagueMatchesScreen';
import { StandingsScreen } from '../screens/Standings/StandingsScreen';
import { NBAGameDetailScreen } from '../screens/NBA/NBAGameDetailScreen';
import { Colors } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeagueMatches"
          component={LeagueMatchesScreen}
          options={({ route }) => ({ title: route.params.leagueName })}
        />
        <Stack.Screen
          name="Standings"
          component={StandingsScreen}
          options={({ route }) => ({ title: `Classement — ${route.params.leagueName}` })}
        />
        <Stack.Screen
          name="MatchDetail"
          component={MatchDetailScreen}
          options={{ title: 'Détail du match' }}
        />
        <Stack.Screen
          name="NBAGameDetail"
          component={NBAGameDetailScreen}
          options={{ title: 'Match NBA' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
