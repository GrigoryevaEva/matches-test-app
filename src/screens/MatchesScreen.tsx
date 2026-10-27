import { MatchesContent } from '../components/MatchesContent';
import { useMatches } from '../hooks/useMatches';

export function MatchesScreen() {
  const { data, loading, error, updatedAt, reload } = useMatches();

  return (
    <MatchesContent
      data={data}
      loading={loading}
      error={error}
      updatedAt={updatedAt}
      onReload={reload}
    />
  );
}
