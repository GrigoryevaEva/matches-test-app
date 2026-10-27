import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function ActionButton({ label, onPress, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accent,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
});
