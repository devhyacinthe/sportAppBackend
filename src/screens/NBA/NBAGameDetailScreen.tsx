import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, NBAGame } from '../../types';
import { Colors } from '../../constants';
import { nbaApi } from '../../services/api';

type Route = RouteProp<RootStackParamList, 'NBAGameDetail'>;

export function NBAGameDetailScreen() {
  const route = useRoute<Route>();
  const { gameId } = route.params;

  const [game, setGame] = useState<NBAGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nbaApi
      .getGameDetail(gameId)
      .then(data => { setGame(data.data ?? data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [gameId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Match introuvable'}</Text>
      </View>
    );
  }

  const isFinished = /final/i.test(game.status);
  const isLive = /^Q[1-4]|Halftime|OT/i.test(game.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.season}>
        🏀 NBA {game.season}-{game.season + 1}{game.postseason ? ' · Playoffs' : ''}
      </Text>

      <View style={styles.scoreboard}>
        <View style={styles.teamCol}>
          <Text style={styles.abbr}>{game.visitor_team.abbreviation}</Text>
          <Text style={styles.city}>{game.visitor_team.city}</Text>
        </View>

        <View style={styles.scoreCol}>
          {isFinished || isLive ? (
            <Text style={styles.bigScore}>
              {game.visitor_team_score} – {game.home_team_score}
            </Text>
          ) : (
            <Text style={styles.bigScore}>–</Text>
          )}
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{game.status}</Text>
            </View>
          )}
          {isFinished && <Text style={styles.finishedText}>Final</Text>}
          {!isFinished && !isLive && (
            <Text style={styles.timeText}>{game.status}</Text>
          )}
        </View>

        <View style={styles.teamCol}>
          <Text style={styles.abbr}>{game.home_team.abbreviation}</Text>
          <Text style={styles.city}>{game.home_team.city}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Détails</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Visiteur</Text>
          <Text style={styles.infoValue}>{game.visitor_team.full_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Domicile</Text>
          <Text style={styles.infoValue}>{game.home_team.full_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Conférence</Text>
          <Text style={styles.infoValue}>{game.home_team.conference}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>
            {new Date(game.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  error: { color: Colors.error, padding: 24, textAlign: 'center' },
  season: { color: Colors.textMuted, textAlign: 'center', fontSize: 13, marginBottom: 16 },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamCol: { flex: 1, alignItems: 'center' },
  abbr: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  city: { color: Colors.textMuted, fontSize: 12, marginTop: 4, textAlign: 'center' },
  scoreCol: { alignItems: 'center', paddingHorizontal: 16 },
  bigScore: { color: Colors.text, fontSize: 38, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#dc2626' },
  liveText: { color: '#dc2626', fontSize: 13, fontWeight: '700' },
  finishedText: { color: Colors.textMuted, fontSize: 13, marginTop: 6 },
  timeText: { color: Colors.primary, fontSize: 13, marginTop: 6, fontWeight: '600' },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: { color: Colors.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { flex: 1, color: Colors.textMuted, fontSize: 14 },
  infoValue: { flex: 2, color: Colors.text, fontSize: 14, fontWeight: '500', textAlign: 'right' },
});
