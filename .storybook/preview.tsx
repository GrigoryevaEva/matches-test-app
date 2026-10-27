import type { Preview } from '@storybook/react-native-web-vite';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../src/theme';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <View style={styles.content}>
          <Story />
        </View>
      </View>
    ),
  ],
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
    minHeight: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
});

export default preview;
