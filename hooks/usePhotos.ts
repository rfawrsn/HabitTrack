import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchPhotos } from '@/services/api/photoApi';
import { toApiError } from '@/services/http/apiError';
import type { PhotoDto } from '@/types/api';

type LoadStatus = 'loading' | 'success' | 'error';

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setPhotos(await fetchPhotos());
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

  return { photos, status, errorMessage, reload };
}
