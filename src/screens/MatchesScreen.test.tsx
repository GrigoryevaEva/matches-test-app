import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import fixtures from '../../data/matches.json';
import { MatchesScreen } from './MatchesScreen';

describe('MatchesScreen', () => {
  it.each(['network failure', 'invalid JSON'])('offers retry after %s', async (failure) => {
    vi.stubGlobal('fetch', failure === 'network failure'
      ? vi.fn(async () => { throw new Error('offline'); })
      : vi.fn(async () => new Response('not JSON')));

    render(<MatchesScreen />);

    expect(await screen.findByRole('button', { name: 'Повторить' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText(/Обновлено/)).not.toBeInTheDocument();
  });

  it('ignores a disposed request when a new screen is opened in StrictMode', async () => {
    let finishOldRequest: (response: Response) => void = () => {};
    const pendingResponse = new Promise<Response>((resolve) => {
      finishOldRequest = resolve;
    });
    vi.stubGlobal('fetch', vi.fn()
      .mockReturnValueOnce(pendingResponse)
      .mockResolvedValue(new Response(JSON.stringify(fixtures))));

    render(<StrictMode><MatchesScreen /></StrictMode>);

    expect(await screen.findByText('Зенит')).toBeInTheDocument();
    await act(async () => {
      finishOldRequest(new Response(JSON.stringify({ round: 99, matches: [] })));
    });

    expect(screen.getAllByTestId(/^match-/)).toHaveLength(8);
    expect(screen.queryByText('Матчей пока нет')).not.toBeInTheDocument();
    expect(screen.queryByText('99 ТУР')).not.toBeInTheDocument();
  });

  it('retains loaded matches on refresh failure and recovers with retry', async () => {
    const replacement = { ...fixtures, matches: [fixtures.matches[4]] };
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(fixtures)))
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify(replacement))));

    render(<MatchesScreen />);
    await screen.findByText('Зенит');
    fireEvent.click(screen.getByRole('button', { name: 'Обновить' }));

    const retry = await screen.findByRole('button', { name: 'Повторить' });
    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить матчи');
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(8);
    expect(screen.getByText(/Обновлено \d+ сек назад/)).toBeInTheDocument();

    fireEvent.click(retry);
    expect(await screen.findByText('Пари Нижний Новгород')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText('Зенит')).not.toBeInTheDocument();
  });

  it('keeps cards and selected conditions during refresh and prevents overlapping updates', async () => {
    let finishRefresh: (response: Response) => void = () => {};
    const pendingRefresh = new Promise<Response>((resolve) => {
      finishRefresh = resolve;
    });
    const changedData = { ...fixtures, matches: [fixtures.matches[0], fixtures.matches[7]] };
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(fixtures)))
      .mockReturnValueOnce(pendingRefresh)
      .mockResolvedValueOnce(new Response(JSON.stringify({ round: 12, matches: [] }))));

    render(<MatchesScreen />);
    await screen.findByText('Зенит');
    fireEvent.click(screen.getByRole('button', { name: 'Предстоящие' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Показывать неизвестные статусы' }));

    const refresh = screen.getByRole('button', { name: 'Обновить' });
    act(() => {
      fireEvent.click(refresh);
      fireEvent.click(refresh);
    });

    expect(screen.getByRole('button', { name: 'Обновляем…' })).toBeDisabled();
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Предстоящие', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();

    await act(async () => {
      finishRefresh(new Response(JSON.stringify(changedData)));
    });

    expect(screen.getAllByTestId(/^match-/)).toHaveLength(1);
    expect(screen.getByText('Динамо Махачкала')).toBeInTheDocument();
    expect(screen.queryByText('Зенит')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Предстоящие', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Обновить' })).toBeEnabled();
  });

  it.each([
    ['missing matches', { round: 12 }],
    ['invalid start date', { ...fixtures, matches: [{ ...fixtures.matches[0], startsAt: 'not-a-date' }] }],
    ['invalid score', { ...fixtures, matches: [{ ...fixtures.matches[0], score: { home: 'two', away: 1 } }] }],
    ['invalid team', { ...fixtures, matches: [{ ...fixtures.matches[0], home: null }] }],
    ['invalid minute', { ...fixtures, matches: [{ ...fixtures.matches[3], minute: 'sixty' }] }],
  ])('offers recovery for %s instead of rendering unusable data', async (_name, data) => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(data))));

    render(<MatchesScreen />);

    expect(await screen.findByRole('button', { name: 'Повторить' })).toBeInTheDocument();
    expect(screen.queryByText(/Обновлено/)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId(/^match-/)).toHaveLength(0);
  });

  it('distinguishes an empty successful response from an empty filter', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ round: 12, matches: [] }))));

    render(<MatchesScreen />);

    expect(await screen.findByText('Матчей пока нет')).toBeInTheDocument();
    expect(screen.queryByText('Нет матчей по выбранным условиям')).not.toBeInTheDocument();
    expect(screen.getByText(/Обновлено \d+ сек назад/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Обновить' })).toBeInTheDocument();
  });

  it('recovers from a failed first request using the visible retry action', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(fixtures))));

    render(<MatchesScreen />);

    expect(screen.queryByText(/Обновлено/)).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Зенит')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(8);
    expect(screen.getByText(/Обновлено \d+ сек назад/)).toBeInTheDocument();
  });

  it('hides only unknown statuses and retains the switch across filter changes', async () => {
    const data = {
      ...fixtures,
      matches: [...fixtures.matches, { ...fixtures.matches[0], id: 'unknown', status: 'toString' }],
    };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(data))));

    render(<MatchesScreen />);
    await screen.findByText('Статус неизвестен');

    const unknownSwitch = screen.getByRole('switch', { name: 'Показывать неизвестные статусы' });

    expect(unknownSwitch).toBeChecked();
    fireEvent.click(unknownSwitch);

    expect(unknownSwitch).not.toBeChecked();
    expect(screen.queryByText('Статус неизвестен')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(8);
    expect(screen.getByText('Идёт · 67′')).toBeInTheDocument();
    expect(screen.getByText('Перенесён')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Предстоящие' }));
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'Все' }));

    expect(unknownSwitch).not.toBeChecked();
    expect(screen.queryByText('Статус неизвестен')).not.toBeInTheDocument();
    fireEvent.click(unknownSwitch);

    expect(screen.getByText('Статус неизвестен')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^match-/)).toHaveLength(9);
  });

  it('explains empty filtered results and restores initial controls after a new session', async () => {
    const data = {
      round: 12,
      matches: [{ ...fixtures.matches[0], status: 'suspended' }],
    };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(data))));

    const firstSession = render(<MatchesScreen />);
    await screen.findByText('Статус неизвестен');
    fireEvent.click(screen.getByRole('switch', { name: 'Показывать неизвестные статусы' }));

    expect(screen.getByText('Нет матчей по выбранным условиям')).toBeInTheDocument();
    expect(screen.queryByTestId('match-m1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Предстоящие' }));
    expect(screen.getByText('Нет предстоящих матчей')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Завершённые' }));
    expect(screen.getByText('Нет завершённых матчей')).toBeInTheDocument();

    firstSession.unmount();
    render(<MatchesScreen />);

    expect(await screen.findByText('Статус неизвестен')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Все', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Показывать неизвестные статусы' })).toBeChecked();
  });

  it('filters upcoming and finished matches without changing server order', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(fixtures))));

    render(<MatchesScreen />);
    await screen.findByText('Зенит');

    expect(screen.getByRole('button', { name: 'Все', pressed: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Предстоящие' }));

    expect(screen.getAllByTestId(/^match-m\d+$/).map((card) => card.getAttribute('data-testid'))).toEqual([
      'match-m5', 'match-m6', 'match-m7', 'match-m8',
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Завершённые' }));

    expect(screen.getAllByTestId(/^match-m\d+$/).map((card) => card.getAttribute('data-testid'))).toEqual([
      'match-m1', 'match-m2', 'match-m3',
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Все' }));

    expect(screen.getAllByTestId(/^match-m\d+$/)).toHaveLength(8);
  });

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
