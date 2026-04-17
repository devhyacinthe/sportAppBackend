import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Standing } from '../types';
import { Colors } from '../constants';

interface Props {
  standings: Standing[];
}

function Row({ s, index }: { s: Standing; index: number }) {
  const isTop4 = s.position <= 4;
  const isTop6 = s.position <= 6;
  const isBottom3 = false; // would need total teams count to determine

  return (
    <View style={[styles.row, index % 2 === 0 ? styles.rowAlt : null]}>
      <Text style={[styles.pos, isTop4 ? styles.blue : isTop6 ? styles.orange : null]}>
        {s.position}
      </Text>
      {s.team.crest ? (
        <Image source={{ uri: s.team.crest }} style={styles.crest} />
      ) : (
        <View style={[styles.crest, styles.crestPh]} />
      )}
      <Text style={styles.teamName} numberOfLines={1}>{s.team.shortName ?? s.team.name}</Text>
      <Text style={styles.cell}>{s.playedGames}</Text>
      <Text style={styles.cell}>{s.won}</Text>
      <Text style={styles.cell}>{s.draw}</Text>
      <Text style={styles.cell}>{s.lost}</Text>
      <Text style={[styles.cell, styles.pts]}>{s.points}</Text>
    </View>
  );
}

export function StandingsTable({ standings }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.pos, styles.headerText]}>#</Text>
        <View style={styles.crest} />
        <Text style={[styles.teamName, styles.headerText]}>Équipe</Text>
        <Text style={[styles.cell, styles.headerText]}>J</Text>
        <Text style={[styles.cell, styles.headerText]}>V</Text>
        <Text style={[styles.cell, styles.headerText]}>N</Text>
        <Text style={[styles.cell, styles.headerText]}>D</Text>
        <Text style={[styles.cell, styles.headerText, styles.pts]}>Pts</Text>
      </View>

      {standings.map((s, i) => (
        <Row key={s.team.id} s={s} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  headerText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pos: {
    width: 24,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  blue: { color: '#3b82f6' },
  orange: { color: '#f59e0b' },
  crest: { width: 20, height: 20, resizeMode: 'contain', marginRight: 8 },
  crestPh: { backgroundColor: Colors.border, borderRadius: 10 },
  teamName: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  cell: {
    width: 26,
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  pts: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
});
