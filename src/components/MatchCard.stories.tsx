import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import fixtures from '../../data/matches.json';
import { MatchCard } from './MatchCard';

const finished = fixtures.matches[0];

const meta = {
  title: 'Матчи/Карточка матча',
  component: MatchCard,
  tags: ['autodocs'],
  args: { match: finished },
} satisfies Meta<typeof MatchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Finished: Story = { name: 'Завершённый матч' };

export const Scoreless: Story = {
  name: 'Счёт 0:0',
  args: { match: fixtures.matches[1] },
};

export const Live: Story = {
  name: 'Идущий матч',
  args: { match: fixtures.matches[3] },
};

export const LiveWithoutMinute: Story = {
  name: 'Идущий матч без минуты',
  args: { match: { ...fixtures.matches[3], minute: undefined } },
};

export const Scheduled: Story = {
  name: 'Предстоящий матч без счёта',
  args: { match: fixtures.matches[4] },
};

export const Postponed: Story = {
  name: 'Перенесённый матч без даты',
  args: { match: fixtures.matches[6] },
};

export const UnknownStatus: Story = {
  name: 'Неизвестный статус',
  args: { match: { ...finished, status: 'suspended' } },
};

export const LongNames: Story = {
  name: 'Длинные названия команд',
  args: {
    match: {
      ...fixtures.matches[4],
      away: { id: 'dynamo-mkh', name: 'Динамо Махачкала', city: 'Махачкала' },
    },
  },
};
