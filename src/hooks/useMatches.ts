import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../api/matches';
import type { MatchesResponse } from '../types/matches';

export function useMatches() {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const request = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    if (request.current) {
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMatches(controller.signal);

      if (!controller.signal.aborted) {
        setData(result);
        setUpdatedAt(new Date());
      }
    } catch {
      if (!controller.signal.aborted) {
        setError('Не удалось загрузить матчи. Проверьте подключение или повторите запрос.');
      }
    } finally {
      if (request.current === controller) {
        request.current = null;

        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    void reload();

    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [reload]);

  return { data, loading, error, updatedAt, reload };
}
