import { StyleSheet, Text, View } from 'react-native';
import type { MatchFilter } from '../domain/matches';
import { colors, spacing } from '../theme';

type Props = {
  filter: MatchFilter;
};

const titles: Record<MatchFilter, string> = {
  all: 'Нет матчей по выбранным условиям',
  upcoming: 'Нет предстоящих матчей',
  finished: 'Нет завершённых матчей',
};

export function MatchesEmptyState({ filter }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titles[filter]}</Text>
      <Text style={styles.description}>Попробуйте изменить фильтр или настройки отображения.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
