import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors, spacing } from '../src/theme';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: spacing.md, backgroundColor: colors.background, minHeight: '100%' }}>
        <View style={{ width: '100%', maxWidth: 800, alignSelf: 'center' }}>
          <Story />
        </View>
      </View>
    ),
  ],
};

export default preview;
