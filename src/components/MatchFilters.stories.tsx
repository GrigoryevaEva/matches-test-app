import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { MatchFilters } from './MatchFilters';

type Props = React.ComponentProps<typeof MatchFilters>;

function InteractiveFilters(args: Props) {
  const [filter, setFilter] = useState(args.filter);
  const [showUnknown, setShowUnknown] = useState(args.showUnknown);

  return (
    <MatchFilters
      filter={filter}
      onFilterChange={setFilter}
      showUnknown={showUnknown}
      onShowUnknownChange={setShowUnknown}
    />
  );
}

const meta = {
  title: 'Матчи/Фильтры',
  component: MatchFilters,
  tags: ['autodocs'],
  args: {
    filter: 'all',
    showUnknown: true,
    onFilterChange: () => {},
    onShowUnknownChange: () => {},
  },
  render: (args) => <InteractiveFilters {...args} key={`${args.filter}-${args.showUnknown}`} />,
} satisfies Meta<typeof MatchFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = { name: 'Все матчи' };

export const Upcoming: Story = {
  name: 'Предстоящие',
  args: { filter: 'upcoming' },
};

export const Finished: Story = {
  name: 'Завершённые',
  args: { filter: 'finished' },
};

export const HiddenUnknown: Story = {
  name: 'Неизвестные статусы скрыты',
  args: { showUnknown: false },
};
