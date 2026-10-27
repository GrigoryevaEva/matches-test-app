import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { getMatchStatus } from '../domain/matches';
import type { Match, Team } from '../types/matches';

type Props = {
  match: Match;
};

function getStatusLabel(match: Match) {
  switch (match.status) {
    case 'scheduled':
      return 'Запланирован';
    case 'finished':
      return 'Завершён';
    case 'postponed':
      return 'Перенесён';
    case 'live':
      return match.minute == null ? 'Идёт' : `Идёт · ${match.minute}′`;
    default:
      return 'Статус неизвестен';
  }
}

function formatStart(startsAt: string | null) {
  if (startsAt === null) {
    return 'Дата уточняется';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(startsAt));
}

function TeamInfo({ team, away = false }: { team: Team; away?: boolean }) {
  return (
    <View style={[styles.team, away && styles.awayTeam]}>
      <View style={[styles.teamBadge, away && styles.awayBadge]}>
        <Text style={styles.teamInitial}>{team.name.slice(0, 1)}</Text>
      </View>

      <Text style={[styles.teamName, away && styles.awayText]}>{team.name}</Text>
      <Text style={[styles.teamCity, away && styles.awayText]}>{team.city}</Text>
      <Text style={styles.teamRole}>{away ? 'ГОСТИ' : 'ХОЗЯЕВА'}</Text>
    </View>
  );
}

export function MatchCard({ match }: Props) {
  const live = match.status === 'live';

  return (
    <View style={[styles.card, live && styles.liveCard]} testID={`match-${match.id}`}>
      <View style={styles.metaRow}>
        <View style={[styles.status, live && styles.liveStatus]}>
          {live && <View style={styles.liveDot} />}
          <Text style={[styles.statusText, live && styles.liveText]}>{getStatusLabel(match)}</Text>
        </View>

        <Text style={styles.sport}>ФУТБОЛ</Text>
      </View>

      <View style={styles.matchRow}>
        <TeamInfo team={match.home} />

        <View style={styles.scoreBlock}>
          <Text style={[styles.score, live && styles.liveText]}>
            {match.score === null ? '—' : `${match.score.home} : ${match.score.away}`}
          </Text>
          <Text style={styles.scoreCaption}>{match.score === null ? 'ВСТРЕЧА' : 'СЧЁТ'}</Text>
        </View>

        <TeamInfo team={match.away} away />
      </View>

      <View style={styles.footer}>
        <Text style={styles.startLabel}>НАЧАЛО МАТЧА</Text>
        <Text style={styles.startTime}>{formatStart(match.startsAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.lg,
  },
  liveCard: {
    borderColor: '#687f43',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
    flexShrink: 1,
  },
  liveStatus: {
    backgroundColor: colors.accentSubtle,
  },
  statusText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  liveText: {
    color: colors.accent,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sport: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  team: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 5,
  },
  awayTeam: {
    alignItems: 'flex-end',
  },
  teamBadge: {
    width: 38,
    height: 42,
    borderRadius: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSubtle,
    marginBottom: spacing.sm,
  },
  awayBadge: {
    backgroundColor: colors.surfaceRaised,
  },
  teamInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  teamName: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    color: colors.text,
  },
  teamCity: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  teamRole: {
    fontSize: 9,
    letterSpacing: 1,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  awayText: {
    textAlign: 'right',
  },
  scoreBlock: {
    width: 92,
    alignItems: 'center',
    gap: 5,
  },
  score: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  scoreCaption: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  startLabel: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1.2,
  },
  startTime: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
});
