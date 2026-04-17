import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBAStanding } from '../types';
import { Colors } from '../constants';

interface Props {
  standings: NBAStanding[];
}

function ConferenceTable({ title, rows }: { title: string; rows: NBAStanding[] }) {
  const sorted = [...rows].sort((a, b) => b.wins / (b.wins + b.losses || 1) - a.wins / (a.wins + a.losses || 1));
  return (
    <View style={styles.block}>
      <View style={styles.confHeader}>
        <Ionicons name="trophy-outline" size={16} color={Colors.primary} />
        <Text style={styles.confTitle}>{title}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.rank, styles.headerText]}>#</Text>
          <Text style={[styles.teamName, styles.headerText]}>Équipe</Text>
          <Text style={[styles.cell, styles.headerText]}>V</Text>
          <Text style={[styles.cell, styles.headerText]}>D</Text>
          <Text style={[styles.cell, styles.headerText]}>%</Text>
        </View>
        {sorted.map((s, i) => (
          <View key={s.team.id} style={[styles.row, i % 2 === 0 ? styles.rowAlt : null]}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.teamName} numberOfLines={1}>{s.team.full_name}</Text>
            <Text style={styles.cell}>{s.wins}</Text>
            <Text style={styles.cell}>{s.losses}</Text>
            <Text style={[styles.cell, styles.pct]}>
              {(s.pct ?? s.wins / (s.wins + s.losses || 1)).toFixed(3).replace('0.', '.')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function NBAStandingsTable({ standings }: Props) {
  const getConf = (s: NBAStanding) =>
    (s.conference ?? s.team?.conference ?? '').toLowerCase();
  const east = standings.filter(s => getConf(s).startsWith('east'));
  const west = standings.filter(s => getConf(s).startsWith('west'));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ConferenceTable title="Conférence Est" rows={east} />
      <ConferenceTable title="Conférence Ouest" rows={west} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  block: { marginBottom: 24 },
  confHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  confTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  table: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceLight,
  },
  headerText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  rowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  rank: { width: 24, color: Colors.text, fontSize: 13, fontWeight: '600' },
  teamName: { flex: 1, color: Colors.text, fontSize: 13 },
  cell: { width: 32, color: Colors.textMuted, fontSize: 12, textAlign: 'center' },
  pct: { color: Colors.text, fontWeight: '600' },
});
