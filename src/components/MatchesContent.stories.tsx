import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import fixtures from '../../data/matches.json';
import { MatchesContent } from './MatchesContent';

const meta = {
  title: 'Матчи/Экран',
  component: MatchesContent,
  tags: ['autodocs'],
  args: {
    data: fixtures,
    loading: false,
    error: null,
    updatedAt: new Date(),
    onReload: () => {},
  },
  decorators: [
    (Story) => (
      <View style={{
        height: 840,
      }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MatchesContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = { name: 'Матчи загружены' };

export const Loading: Story = {
  name: 'Первая загрузка',
  args: { data: null, loading: true, updatedAt: null },
};

export const InitialError: Story = {
  name: 'Ошибка первой загрузки',
  args: { data: null, error: 'Не удалось загрузить матчи. Повторите запрос.', updatedAt: null },
};

export const Empty: Story = {
  name: 'Матчей пока нет',
  args: { data: { round: 12, matches: [] } },
};

export const Refreshing: Story = {
  name: 'Обновление с предыдущими данными',
  args: { loading: true },
};

export const RefreshError: Story = {
  name: 'Ошибка обновления с предыдущими данными',
  args: { error: 'Не удалось обновить матчи. Предыдущие данные сохранены.' },
};
