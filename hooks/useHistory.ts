import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchHistory } from '@/services/api/historyApi';
import { toApiError } from '@/services/http/apiError';
import type { HistoryResponseDto } from '@/types/api';

const HISTORY_DAYS = 30;

type LoadStatus = 'loading' | 'success' | 'error';

export function useHistory() {
  const [history, setHistory] = useState<HistoryResponseDto | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setHistory(await fetchHistory(HISTORY_DAYS));
      setErrorMessage(null);
      setStatus('success');
    } catch (error) {
      setErrorMessage(toApiError(error).message);
      setStatus('error');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { history, status, errorMessage, reload };
}
