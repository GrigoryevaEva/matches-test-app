import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { MatchesEmptyState } from './MatchesEmptyState';

const meta = {
  title: 'Матчи/Пустой результат фильтра',
  component: MatchesEmptyState,
  tags: ['autodocs'],
  args: { filter: 'all' },
} satisfies Meta<typeof MatchesEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllHidden: Story = { name: 'Все неизвестные матчи скрыты' };

export const NoUpcoming: Story = {
  name: 'Нет предстоящих матчей',
  args: { filter: 'upcoming' },
};

export const NoFinished: Story = {
  name: 'Нет завершённых матчей',
  args: { filter: 'finished' },
};
