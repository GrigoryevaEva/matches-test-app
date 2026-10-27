import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { MatchFilters } from '../components/MatchFilters';
import { MatchesEmptyState } from '../components/MatchesEmptyState';
import { filterMatches, type MatchFilter } from '../domain/matches';
import { useMatches } from '../hooks/useMatches';
import { colors, spacing } from '../theme';

export function MatchesScreen() {
  const { data, loading, error } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [showUnknown, setShowUnknown] = useState(true);
  const matches = filterMatches(data?.matches ?? [], filter, showUnknown);

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}><Text style={styles.brandLetter}>М</Text></View>
        <Text style={styles.brandName}>МАТЧЦЕНТР</Text>
        <View style={styles.sportBadge}><Text style={styles.sportText}>ФУТБОЛ</Text></View>
      </View>

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>НА ПОЛЕ — ВСЁ НАСТОЯЩЕЕ</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Матчи тура</Text>
          {data && <Text style={styles.round}>{data.round} ТУР</Text>}
        </View>
        <Text style={styles.subtitle}>Весь тур. Каждая встреча. Один экран.</Text>
      </View>

      <MatchFilters
        filter={filter}
        onFilterChange={setFilter}
        showUnknown={showUnknown}
        onShowUnknownChange={setShowUnknown}
      />

      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator accessibilityLabel="Загрузка матчей" color={colors.accent} size="large" />
          <Text style={styles.messageText}>Загружаем матчи…</Text>
        </View>
      ) : error ? (
        <View style={styles.message}><Text style={styles.messageText}>{error}</Text></View>
      ) : (
        <FlatList
          data={matches}
          renderItem={({ item }) => <MatchCard match={item} />}
          keyExtractor={(match) => match.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>РАСПИСАНИЕ</Text>
              <Text style={styles.matchCount}>Матчей: {matches.length}</Text>
            </View>
          }
          ListEmptyComponent={<MatchesEmptyState filter={filter} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: spacing.md,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  brandLetter: {
    color: colors.background,
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  sportBadge: {
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  sportText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  heading: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: 10,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  round: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.accentSubtle,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 2,
  },
  listTitle: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  matchCount: {
    color: colors.muted,
    fontSize: 11,
  },
  message: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  messageText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
