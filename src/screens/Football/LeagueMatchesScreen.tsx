import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants';
import { useLeagueMatches } from '../../hooks/useMatches';
import { MatchCard } from '../../components/MatchCard';

type Route = RouteProp<RootStackParamList, 'LeagueMatches'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_ORDER: Record<string, number> = {
  IN_PLAY: 0,
  PAUSED: 1,
  TIMED: 2,
  SCHEDULED: 3,
  FINISHED: 4,
};

export function LeagueMatchesScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { leagueCode, leagueName, leagueFlag } = route.params;

  const { matches, loading, error, refresh } = useLeagueMatches(leagueCode);

  const sorted = [...matches].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 5) - (STATUS_ORDER[b.status] ?? 5) ||
      new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={sorted}
      keyExtractor={item => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refresh} tintColor={Colors.primary} />
      }
      ListHeaderComponent={
        <Text style={styles.heading}>{leagueFlag} {leagueName}</Text>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>Aucun match disponible</Text>
      }
      renderItem={({ item }) => (
        <MatchCard
          match={item}
          onPress={() =>
            navigation.navigate('MatchDetail', {
              matchId: item.id,
              leagueCode,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  heading: { color: Colors.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
  center: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  error: { color: Colors.error, textAlign: 'center', padding: 24 },
  empty: { color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
});
