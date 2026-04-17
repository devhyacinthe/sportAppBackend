import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors } from '../../constants';
import { useNBAGames, useNBAStandings, useNBAPlayoffs } from '../../hooks/useNBA';
import { NBAGameCard } from '../../components/NBAGameCard';
import { NBAStandingsTable } from '../../components/NBAStandingsTable';
import { PlayoffBracket } from '../../components/PlayoffBracket';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'games' | 'standings' | 'playoffs';

const TABS: { key: Tab; label: string }[] = [
  { key: 'games',     label: 'Matchs' },
  { key: 'standings', label: 'Classement' },
  { key: 'playoffs',  label: 'Playoffs' },
];

function DateNav({ date, onChange }: { date: string; onChange: (d: string) => void }) {
  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    onChange(d.toISOString().slice(0, 10));
  }
  const label = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  return (
    <View style={styles.dateNav}>
      <TouchableOpacity onPress={() => shift(-1)} style={styles.arrow}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.dateLabel}>{label}</Text>
      <TouchableOpacity onPress={() => shift(1)} style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

export function NBAScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('games');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { games, loading: gamesLoading, refresh: refreshGames } = useNBAGames(date);
  const { standings, loading: standingsLoading, error: standingsError } = useNBAStandings();
  const { series, season, loading: playoffsLoading, error: playoffsError, refresh: refreshPlayoffs } = useNBAPlayoffs();

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key ? styles.tabActive : null]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key ? styles.tabTextActive : null]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Matchs */}
      {tab === 'games' && (
        <>
          <DateNav date={date} onChange={d => setDate(d)} />
          {gamesLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={games}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={refreshGames} tintColor={Colors.primary} />
              }
              ListEmptyComponent={
                <Text style={styles.empty}>Aucun match ce jour</Text>
              }
              renderItem={({ item }) => (
                <NBAGameCard
                  game={item}
                  onPress={() => navigation.navigate('NBAGameDetail', { gameId: item.id })}
                />
              )}
            />
          )}
        </>
      )}

      {/* Classement */}
      {tab === 'standings' && (
        standingsLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : standingsError ? (
          <Text style={styles.error}>{standingsError}</Text>
        ) : standings.length === 0 ? (
          <Text style={styles.empty}>Classement non disponible</Text>
        ) : (
          <NBAStandingsTable standings={standings} />
        )
      )}

      {/* Playoffs */}
      {tab === 'playoffs' && (
        playoffsLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : playoffsError ? (
          <Text style={styles.error}>{playoffsError}</Text>
        ) : (
          <PlayoffBracket
            series={series}
            season={season}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 20,
  },
  arrow: { padding: 8 },
  arrowText: { color: Colors.text, fontSize: 24 },
  dateLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
    minWidth: 160,
    textAlign: 'center',
  },
  list: { padding: 16, paddingBottom: 32 },
  empty: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  error: { color: Colors.error, textAlign: 'center', marginTop: 40, padding: 16 },
});
