import { useEffect, useState } from 'react';
import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types/matches';

export function useMatches() {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMatches() {
      try {
        const response = await fetch(MATCHES_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('Не удалось загрузить матчи');
        }

        const result: MatchesResponse = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Не удалось загрузить матчи. Проверьте подключение к интернету.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMatches();

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
