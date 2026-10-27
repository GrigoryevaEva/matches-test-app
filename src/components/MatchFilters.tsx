import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { MatchFilter } from '../domain/matches';
import { colors, spacing } from '../theme';

type Props = {
  filter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
  showUnknown: boolean;
  onShowUnknownChange: (value: boolean) => void;
};

const filters: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

export function MatchFilters({ filter, onFilterChange, showUnknown, onShowUnknownChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {filters.map((item) => (
          <Pressable
            key={item.value}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item.value }}
            aria-pressed={filter === item.value}
            onPress={() => onFilterChange(item.value)}
            style={[styles.tab, filter === item.value && styles.selectedTab]}
          >
            <Text style={[styles.tabText, filter === item.value && styles.selectedText]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Показывать неизвестные статусы</Text>
        <Switch
          accessibilityLabel="Показывать неизвестные статусы"
          value={showUnknown}
          onValueChange={onShowUnknownChange}
          trackColor={{
            false: colors.border,
            true: colors.accentSubtle,
          }}
          thumbColor={showUnknown ? colors.accent : colors.muted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.xs,
    borderRadius: 9,
  },
  selectedTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedText: {
    color: colors.background,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  switchLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    flexShrink: 1,
  },
});
