import { act, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import fixtures from '../../data/matches.json';
import { MatchesScreen } from './MatchesScreen';

describe('MatchesScreen', () => {
  it('shows loading, then the supplied matches in server order with their scores and statuses', async () => {
    let finishRequest: (response: Response) => void = () => {};
    const pendingResponse = new Promise<Response>((resolve) => {
      finishRequest = resolve;
    });
    vi.stubGlobal('fetch', vi.fn(() => pendingResponse));

    render(<MatchesScreen />);

    expect(screen.getByRole('progressbar', { name: 'Загрузка матчей' })).toBeInTheDocument();

    await act(async () => {
      finishRequest(new Response(JSON.stringify(fixtures)));
    });

    const cards = await screen.findAllByTestId(/^match-m\d+$/);

    expect(cards).toHaveLength(8);
    expect(cards.map((card) => card.getAttribute('data-testid'))).toEqual([
      'match-m1', 'match-m2', 'match-m3', 'match-m4', 'match-m5', 'match-m6', 'match-m7', 'match-m8',
    ]);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(within(cards[0]).getByText('Зенит')).toBeInTheDocument();
    expect(within(cards[0]).getByText('Спартак')).toBeInTheDocument();
    expect(within(cards[0]).getByText('2 : 1')).toBeInTheDocument();
    expect(within(cards[1]).getByText('0 : 0')).toBeInTheDocument();
    expect(within(cards[3]).getByText('Идёт · 67′')).toBeInTheDocument();
    expect(within(cards[4]).getByText('—')).toBeInTheDocument();
    expect(within(cards[6]).getByText('Перенесён')).toBeInTheDocument();
    expect(within(cards[6]).getByText('Дата уточняется')).toBeInTheDocument();
  });

  it('keeps an unknown status and a live match without a minute readable', async () => {
    const data = {
      round: 12,
      matches: [
        { ...fixtures.matches[0], status: 'toString' },
        { ...fixtures.matches[3], minute: undefined },
      ],
    };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(data))));

    render(<MatchesScreen />);

    expect(await screen.findByText('Статус неизвестен')).toBeInTheDocument();
    expect(screen.getByText('Идёт')).toBeInTheDocument();
  });

  it.each([
    ['Europe/Moscow', /12 октября.*02:30/],
    ['America/Los_Angeles', /11 октября.*16:30/],
  ])('shows the device-local date and time in %s, including date rollover', async (timeZone, expected) => {
    vi.stubEnv('TZ', timeZone);
    const data = {
      round: 12,
      matches: [{ ...fixtures.matches[0], startsAt: '2026-10-11T23:30:00Z' }],
    };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(data))));

    render(<MatchesScreen />);

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });
});
