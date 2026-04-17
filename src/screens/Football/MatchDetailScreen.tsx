import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, FootballMatch } from '../../types';
import { Colors } from '../../constants';
import { footballApi } from '../../services/api';
import { LiveBadge } from '../../components/LiveBadge';

type Route = RouteProp<RootStackParamList, 'MatchDetail'>;

function StatRow({ label, home, away }: { label: string; home: string | number; away: string | number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{home}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{away}</Text>
    </View>
  );
}

export function MatchDetailScreen() {
  const route = useRoute<Route>();
  const { matchId } = route.params;

  const [match, setMatch] = useState<FootballMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    footballApi
      .getMatchDetail(matchId)
      .then(data => {
        setMatch(data.match ?? data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Match introuvable'}</Text>
      </View>
    );
  }

  const { homeTeam, awayTeam, score, status, utcDate, competition, matchday } = match;
  const kickoff = new Date(utcDate).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Competition */}
      <Text style={styles.competition}>
        {competition.name}{matchday ? ` · J${matchday}` : ''}
      </Text>

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.teamCol}>
          {homeTeam.crest && (
            <Image source={{ uri: homeTeam.crest }} style={styles.bigCrest} />
          )}
          <Text style={styles.teamName}>{homeTeam.shortName ?? homeTeam.name}</Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={styles.bigScore}>
            {score.fullTime.home ?? '-'} – {score.fullTime.away ?? '-'}
          </Text>
          <LiveBadge status={status} minute={match.minute} />
          {(status === 'SCHEDULED' || status === 'TIMED') && (
            <Text style={styles.kickoff}>{kickoff}</Text>
          )}
          {score.halfTime.home !== null && (
            <Text style={styles.halfTime}>
              Mi-temps : {score.halfTime.home} – {score.halfTime.away}
            </Text>
          )}
        </View>

        <View style={styles.teamCol}>
          {awayTeam.crest && (
            <Image source={{ uri: awayTeam.crest }} style={styles.bigCrest} />
          )}
          <Text style={styles.teamName}>{awayTeam.shortName ?? awayTeam.name}</Text>
        </View>
      </View>

      {/* Head-to-head placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <StatRow label="Compétition" home="" away={competition.name} />
        {matchday && <StatRow label="Journée" home="" away={matchday} />}
        <StatRow
          label="Date"
          home=""
          away={new Date(utcDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  error: { color: Colors.error, padding: 24, textAlign: 'center' },
  competition: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamCol: { flex: 1, alignItems: 'center', gap: 8 },
  bigCrest: { width: 56, height: 56, resizeMode: 'contain' },
  teamName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreCol: { alignItems: 'center', paddingHorizontal: 12, gap: 6 },
  bigScore: { color: Colors.text, fontSize: 36, fontWeight: '800' },
  kickoff: { color: Colors.primary, fontSize: 13, textAlign: 'center' },
  halfTime: { color: Colors.textMuted, fontSize: 12 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statValue: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  statLabel: {
    flex: 2,
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
