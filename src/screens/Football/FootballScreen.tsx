import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, League } from '../../types';
import { Colors, LEAGUES } from '../../constants';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FootballScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <FlatList
        data={LEAGUES}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.heading}>Compétitions</Text>
        }
        renderItem={({ item }: { item: League }) => (
          <View style={styles.leagueCard}>
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate('LeagueMatches', {
                  leagueCode: item.code,
                  leagueName: item.name,
                  leagueFlag: item.flag,
                })
              }
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={styles.leagueName}>{item.name}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.row, styles.standingsRow]}
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate('Standings', {
                  leagueCode: item.code,
                  leagueName: item.name,
                  leagueFlag: item.flag,
                })
              }
            >
              <Text style={styles.standingsLabel}>📊 Classement</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingBottom: 32 },
  heading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  leagueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  standingsRow: { paddingVertical: 11 },
  separator: { height: 1, backgroundColor: Colors.border },
  flag: { fontSize: 22 },
  leagueName: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  standingsLabel: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 14,
  },
  arrow: {
    color: Colors.textMuted,
    fontSize: 20,
  },
});
