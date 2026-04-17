import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants';
import { useStandings } from '../../hooks/useStandings';
import { StandingsTable } from '../../components/StandingsTable';

type Route = RouteProp<RootStackParamList, 'Standings'>;

export function StandingsScreen() {
  const route = useRoute<Route>();
  const { leagueCode, leagueName, leagueFlag } = route.params;
  const { standings, groups, loading, error, refresh } = useStandings(leagueCode);

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refresh} tintColor={Colors.primary} />
      }
    >
      <Text style={styles.heading}>{leagueFlag} {leagueName}</Text>

      {/* World Cup / multi-group competitions */}
      {groups.length > 1 ? (
        groups.map(group => (
          <View key={`${group.stage}-${group.group}`} style={styles.groupBlock}>
            {group.group && (
              <Text style={styles.groupLabel}>{group.group}</Text>
            )}
            <StandingsTable standings={group.table} />
          </View>
        ))
      ) : (
        <StandingsTable standings={standings} />
      )}

      <View style={styles.legend}>
        <Text style={styles.legendItem}><Text style={styles.blue}>■</Text> Ligue des champions</Text>
        <Text style={styles.legendItem}><Text style={styles.orange}>■</Text> Ligue Europa</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  heading: { color: Colors.text, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  groupBlock: { marginBottom: 20 },
  groupLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  center: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  error: { color: Colors.error, padding: 24, textAlign: 'center' },
  legend: { marginTop: 16, gap: 4 },
  legendItem: { color: Colors.textMuted, fontSize: 12 },
  blue: { color: '#3b82f6' },
  orange: { color: '#f59e0b' },
});
