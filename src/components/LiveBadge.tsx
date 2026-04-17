import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MatchStatus } from '../types';
import { Colors } from '../constants';

interface Props {
  status: MatchStatus | string;
  minute?: number;
}

export function LiveBadge({ status, minute }: Props) {
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinished = status === 'FINISHED';

  if (!isLive && !isFinished && status !== 'PAUSED') {
    return null;
  }

  return (
    <View style={[styles.badge, isLive ? styles.live : styles.finished]}>
      {isLive && <View style={styles.dot} />}
      <Text style={styles.text}>
        {isLive ? (minute ? `${minute}'` : 'LIVE') : 'FIN'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  live: { backgroundColor: '#dc2626' },
  finished: { backgroundColor: Colors.surfaceLight },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  text: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
