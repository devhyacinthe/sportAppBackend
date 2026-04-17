import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NBAGame } from '../types';
import { Colors } from '../constants';

interface Props {
  game: NBAGame;
  onPress?: () => void;
}

function isLive(status: string) {
  return /^Q[1-4]|Halftime|OT/i.test(status);
}

function isFinished(status: string) {
  return /final/i.test(status);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

function ScorerLine({ scorer }: { scorer: { player: string; pts: number } | null | undefined }) {
  if (!scorer) return null;
  return (
    <Text style={styles.scorer}>
      {scorer.player}  <Text style={styles.scorerPts}>{scorer.pts} pts</Text>
    </Text>
  );
}

export function NBAGameCard({ game, onPress }: Props) {
  const live = isLive(game.status);
  const finished = isFinished(game.status);
  const showScore = finished || live;

  return (
    <TouchableOpacity
      style={[styles.card, live ? styles.cardLive : null]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Visitor team */}
      <View style={styles.row}>
        <Text style={styles.teamAbbr}>{game.visitor_team.abbreviation}</Text>
        <Text style={styles.cityName}>{game.visitor_team.city}</Text>
        <Text style={styles.score}>{showScore ? game.visitor_team_score : '-'}</Text>
      </View>
      <ScorerLine scorer={game.topScorers?.visitor} />

      <View style={styles.divider} />

      {/* Home team */}
      <View style={styles.row}>
        <Text style={styles.teamAbbr}>{game.home_team.abbreviation}</Text>
        <Text style={styles.cityName}>{game.home_team.city}</Text>
        <Text style={styles.score}>{showScore ? game.home_team_score : '-'}</Text>
      </View>
      <ScorerLine scorer={game.topScorers?.home} />

      {/* Pills row */}
      <View style={styles.pillsRow}>
        <View style={styles.datePill}>
          <Text style={styles.datePillText}>{formatDate(game.date)}</Text>
        </View>

        {live ? (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>{game.status}</Text>
          </View>
        ) : finished ? (
          <View style={styles.finishedPill}>
            <Text style={styles.finishedPillText}>Final</Text>
          </View>
        ) : (
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>{game.status}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLive: { borderColor: '#dc2626' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  teamAbbr: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    width: 42,
  },
  cityName: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 13,
  },
  score: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  scorer: {
    marginLeft: 42,
    marginTop: 1,
    marginBottom: 4,
    color: Colors.textMuted,
    fontSize: 11,
  },
  scorerPts: {
    color: Colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  datePill: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  datePillText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  livePillText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
  finishedPill: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  finishedPillText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  timePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timePillText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
});
