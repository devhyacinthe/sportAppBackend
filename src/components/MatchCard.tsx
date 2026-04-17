import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FootballMatch } from '../types';
import { Colors } from '../constants';
import { LiveBadge } from './LiveBadge';

interface Props {
  match: FootballMatch;
  onPress?: () => void;
  showCompetition?: boolean;
}

function TeamRow({ name, crest, score }: { name: string; crest?: string; score: number | null }) {
  return (
    <View style={styles.teamRow}>
      {crest ? (
        <Image source={{ uri: crest }} style={styles.crest} />
      ) : (
        <View style={[styles.crest, styles.crestPlaceholder]} />
      )}
      <Text style={styles.teamName} numberOfLines={1}>{name}</Text>
      <Text style={styles.score}>{score ?? '-'}</Text>
    </View>
  );
}

export function MatchCard({ match, onPress, showCompetition = false }: Props) {
  const { homeTeam, awayTeam, score, status, utcDate, competition } = match;
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isScheduled = status === 'SCHEDULED' || status === 'TIMED';

  const kickoffTime = new Date(utcDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={[styles.card, isLive ? styles.cardLive : null]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {showCompetition && (
        <Text style={styles.competition}>{competition.name}</Text>
      )}

      <View style={styles.body}>
        <View style={styles.teams}>
          <TeamRow
            name={homeTeam.shortName ?? homeTeam.name}
            crest={homeTeam.crest}
            score={score.fullTime.home}
          />
          <TeamRow
            name={awayTeam.shortName ?? awayTeam.name}
            crest={awayTeam.crest}
            score={score.fullTime.away}
          />
        </View>

        <View style={styles.right}>
          {isLive || status === 'FINISHED' ? (
            <LiveBadge status={status} minute={match.minute} />
          ) : isScheduled ? (
            <Text style={styles.time}>{kickoffTime}</Text>
          ) : (
            <Text style={styles.statusText}>{status}</Text>
          )}
        </View>
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
  cardLive: {
    borderColor: '#dc2626',
  },
  competition: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teams: {
    flex: 1,
    gap: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crest: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  crestPlaceholder: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 11,
  },
  teamName: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  score: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'right',
  },
  right: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  time: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
