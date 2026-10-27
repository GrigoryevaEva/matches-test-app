import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { ActionButton } from './ActionButton';

type Props = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function MatchesRequestState({ loading, error, onRetry }: Props) {
  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator accessibilityLabel="Загрузка матчей" color={colors.accent} size="large" />
          <Text style={styles.text}>Загружаем матчи…</Text>
        </>
      ) : error ? (
        <>
          <Text accessibilityRole="alert" style={styles.text}>{error}</Text>
          <ActionButton label="Повторить" onPress={onRetry} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
