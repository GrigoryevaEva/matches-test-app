import type { Match } from '../types/matches';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

type MatchStatus = {
  label: string;
  filter: MatchFilter;
  known: boolean;
};

const statuses = new Map<string, MatchStatus>([
  ['scheduled', { label: 'Запланирован', filter: 'upcoming', known: true }],
  ['postponed', { label: 'Перенесён', filter: 'upcoming', known: true }],
  ['finished', { label: 'Завершён', filter: 'finished', known: true }],
  ['live', { label: 'Идёт', filter: 'all', known: true }],
]);

const unknownStatus: MatchStatus = {
  label: 'Статус неизвестен',
  filter: 'all',
  known: false,
};

export function getMatchStatus(status: string): MatchStatus {
  return statuses.get(status) ?? unknownStatus;
}

export function filterMatches(matches: Match[], filter: MatchFilter, showUnknown: boolean) {
  return matches.filter((match) => {
    const status = getMatchStatus(match.status);

    return filter === 'all' ? showUnknown || status.known : status.filter === filter;
  });
}
