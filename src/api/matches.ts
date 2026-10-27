import { MATCHES_URL } from '../config';
import type { Match, MatchesResponse, Team } from '../types/matches';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTeam(value: unknown): value is Team {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.city === 'string';
}

function isMatch(value: unknown): value is Match {
  if (!isRecord(value)) {
    return false;
  }

  const score = value.score;
  const validScore = score === null || (isRecord(score) && isNumber(score.home) && isNumber(score.away));
  const validDate = value.startsAt === null
    || (typeof value.startsAt === 'string' && !Number.isNaN(Date.parse(value.startsAt)));

  return typeof value.id === 'string'
    && typeof value.status === 'string'
    && isTeam(value.home)
    && isTeam(value.away)
    && validScore
    && validDate
    && (value.minute === undefined || isNumber(value.minute));
}

export async function fetchMatches(signal: AbortSignal): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL, { signal });

  if (!response.ok) {
    throw new Error('Не удалось загрузить матчи');
  }

  const result: unknown = await response.json();

  if (!isRecord(result) || !isNumber(result.round) || !Array.isArray(result.matches)
    || !result.matches.every(isMatch)) {
    throw new Error('Сервер вернул некорректные данные матчей');
  }

  return { round: result.round, matches: result.matches };
}
