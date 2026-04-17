import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBASeries } from '../types';
import { Colors } from '../constants';

interface Props {
  series: NBASeries[];
  season: number | null;
}

function WinDots({ wins, isWinner }: { wins: number; isWinner: boolean }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < wins ? (isWinner ? styles.dotWon : styles.dotActive) : styles.dotEmpty,
          ]}
        />
      ))}
    </View>
  );
}

function SeriesCard({ s }: { s: NBASeries }) {
  const finished = s.status === 'finished';
  const winnerIsA = s.winner?.id === s.teamA.id;
  const winnerIsB = s.winner?.id === s.teamB.id;

  return (
    <View style={[styles.card, finished ? styles.cardFinished : styles.cardOngoing]}>
      {/* Team A */}
      <View style={[styles.teamRow, winnerIsA && styles.teamRowWinner]}>
        <Text style={[styles.abbr, winnerIsA && styles.abbrWinner]}>
          {s.teamA.abbreviation}
        </Text>
        <Text style={[styles.teamName, winnerIsA && styles.teamNameWinner]} numberOfLines={1}>
          {s.teamA.city}
        </Text>
        <WinDots wins={s.winsA} isWinner={winnerIsA} />
        <Text style={[styles.winsNum, winnerIsA && styles.winsNumWinner]}>{s.winsA}</Text>
        {winnerIsA && <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.check} />}
      </View>

      {/* Team B */}
      <View style={[styles.teamRow, winnerIsB && styles.teamRowWinner]}>
        <Text style={[styles.abbr, winnerIsB && styles.abbrWinner]}>
          {s.teamB.abbreviation}
        </Text>
        <Text style={[styles.teamName, winnerIsB && styles.teamNameWinner]} numberOfLines={1}>
          {s.teamB.city}
        </Text>
        <WinDots wins={s.winsB} isWinner={winnerIsB} />
        <Text style={[styles.winsNum, winnerIsB && styles.winsNumWinner]}>{s.winsB}</Text>
        {winnerIsB && <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.check} />}
      </View>

      {!finished && (
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>En cours</Text>
        </View>
      )}
    </View>
  );
}

function RoundSection({ label, items }: { label: string; items: NBASeries[] }) {
  const east = items.filter(s => s.conference === 'East');
  const west = items.filter(s => s.conference === 'West');
  const finals = items.filter(s => s.conference === 'Finals');

  return (
    <View style={styles.roundBlock}>
      <Text style={styles.roundLabel}>{label}</Text>

      {east.length > 0 && (
        <View style={styles.confSection}>
          <Text style={styles.confLabel}>Conférence Est</Text>
          {east.map(s => <SeriesCard key={s.id} s={s} />)}
        </View>
      )}

      {west.length > 0 && (
        <View style={styles.confSection}>
          <Text style={styles.confLabel}>Conférence Ouest</Text>
          {west.map(s => <SeriesCard key={s.id} s={s} />)}
        </View>
      )}

      {finals.map(s => <SeriesCard key={s.id} s={s} />)}
    </View>
  );
}

export function PlayoffBracket({ series, season }: Props) {
  if (series.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="trophy-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.emptyText}>Aucune donnée de playoffs</Text>
        <Text style={styles.emptyHint}>Les playoffs débutent en avril</Text>
      </View>
    );
  }

  // Group by round
  const rounds = new Map<number, { label: string; items: NBASeries[] }>();
  for (const s of series) {
    if (!rounds.has(s.round)) {
      rounds.set(s.round, { label: s.roundLabel, items: [] });
    }
    rounds.get(s.round)!.items.push(s);
  }

  const sortedRounds = Array.from(rounds.entries()).sort(([a], [b]) => a - b);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {season && (
        <Text style={styles.title}>Playoffs NBA {season}-{season + 1}</Text>
      )}
      {sortedRounds.map(([round, { label, items }]) => (
        <RoundSection key={round} label={label} items={items} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  roundBlock: { marginBottom: 24 },
  roundLabel: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  confSection: { marginBottom: 12 },
  confLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardFinished: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  cardOngoing: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  teamRowWinner: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  abbr: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    width: 36,
  },
  abbrWinner: { color: Colors.text },
  teamName: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 13,
  },
  teamNameWinner: { color: Colors.text, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotActive: { backgroundColor: Colors.primary },
  dotWon: { backgroundColor: Colors.primary },
  dotEmpty: { backgroundColor: Colors.border },
  winsNum: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    width: 18,
    textAlign: 'center',
  },
  winsNumWinner: { color: Colors.text },
  check: { marginLeft: 2 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  liveText: { color: '#22c55e', fontSize: 11, fontWeight: '600' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { color: Colors.textMuted, fontSize: 16, fontWeight: '600' },
  emptyHint: { color: Colors.textMuted, fontSize: 13 },
});
