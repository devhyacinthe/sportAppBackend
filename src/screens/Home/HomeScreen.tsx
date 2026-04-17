import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, FootballMatch, NBAGame } from '../../types';
import { Colors } from '../../constants';
import { useMatches } from '../../hooks/useMatches';
import { useNBAGames } from '../../hooks/useNBA';
import { MatchCard } from '../../components/MatchCard';
import { NBAGameCard } from '../../components/NBAGameCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function SectionHeader({ title, icon }: { title: string; icon: IoniconName }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const football = useMatches({ live: false, refreshInterval: 60_000 });
  const nba = useNBAGames();

  const liveMatches = football.matches.filter(
    m => m.status === 'IN_PLAY' || m.status === 'PAUSED',
  );
  const upcomingMatches = football.matches
    .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .slice(0, 8);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([football.refresh(), nba.refresh()]);
    setRefreshing(false);
  }

  const loading = football.loading && nba.loading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SportApp</Text>
        <Text style={styles.headerSub}>
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      {loading && (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      )}

      {liveMatches.length > 0 && (
        <>
          <SectionHeader title="En direct" icon="radio-button-on" />
          {liveMatches.map((m: FootballMatch) => (
            <MatchCard
              key={m.id}
              match={m}
              showCompetition
              onPress={() =>
                navigation.navigate('MatchDetail', {
                  matchId: m.id,
                  leagueCode: m.competition.code,
                })
              }
            />
          ))}
        </>
      )}

      {nba.games.length > 0 && (
        <>
          <SectionHeader title="NBA — Aujourd'hui" icon="basketball-outline" />
          {nba.games.slice(0, 6).map((g: NBAGame) => (
            <NBAGameCard
              key={g.id}
              game={g}
              onPress={() => navigation.navigate('NBAGameDetail', { gameId: g.id })}
            />
          ))}
        </>
      )}

      {upcomingMatches.length > 0 && (
        <>
          <SectionHeader title="À venir" icon="calendar-outline" />
          {upcomingMatches.map((m: FootballMatch) => (
            <MatchCard
              key={m.id}
              match={m}
              showCompetition
              onPress={() =>
                navigation.navigate('MatchDetail', {
                  matchId: m.id,
                  leagueCode: m.competition.code,
                })
              }
            />
          ))}
        </>
      )}

      {!loading &&
        liveMatches.length === 0 &&
        upcomingMatches.length === 0 &&
        nba.games.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun match aujourd'hui</Text>
            <Text style={styles.emptyHint}>Tire vers le bas pour rafraîchir</Text>
          </View>
        )}

      {(football.error || nba.error) && (
        <Text style={styles.error}>
          {football.error ?? nba.error}
          {'\n'}Démarre le backend : cd backend && npm run dev
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 20 },
  headerTitle: { color: Colors.text, fontSize: 24, fontWeight: '700' },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: Colors.textMuted, fontSize: 16 },
  emptyHint: { color: Colors.textMuted, fontSize: 13, marginTop: 6 },
  error: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
    lineHeight: 20,
  },
});
