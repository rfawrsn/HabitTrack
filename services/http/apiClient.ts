import axios, { AxiosRequestConfig } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { getStoredToken } from '@/services/auth/tokenStorage';
import { mockAdapter } from '@/services/mock/mockAdapter';
import { ApiError, isConnectionError, isRetryableError, toApiError } from '@/services/http/apiError';
import { buildCacheKey, readCachedResponse, writeCachedResponse } from '@/services/http/responseCache';
import { wait } from '@/utils/async';

export const REQUEST_TIMEOUT_MS = 8000;
const MAX_GET_RETRIES = 2;
const RETRY_DELAY_MS = 600;

const httpClient = axios.create({
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  adapter: mockAdapter,
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function withTimeout<T>(request: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new ApiError('TIMEOUT', 'Permintaan terlalu lama. Coba lagi.')),
      ms,
    );
  });
  return Promise.race([request, timeout]).finally(() => clearTimeout(timer));
}

async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected !== false;
}

// GET responses are cached so screens still show the last known data when the device is offline.
// Writes are never retried or cached; they fail with a clear message instead.
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const method = (config.method ?? 'get').toUpperCase();
  const cacheKey = method === 'GET' ? buildCacheKey(config.url ?? '', config.params) : null;

  if (!(await isOnline())) {
    const cached = cacheKey ? await readCachedResponse<T>(cacheKey) : null;
    if (cached !== null) return cached;
    throw new ApiError('OFFLINE', 'Anda sedang offline. Hubungkan ke internet lalu coba lagi.');
  }

  const maxRetries = cacheKey ? MAX_GET_RETRIES : 0;
  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await withTimeout(httpClient.request<T>(config), REQUEST_TIMEOUT_MS);
      if (cacheKey) await writeCachedResponse(cacheKey, response.data);
      return response.data;
    } catch (error) {
      const apiError = toApiError(error);
      if (attempt < maxRetries && isRetryableError(apiError)) {
        await wait(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      const cached = cacheKey && isConnectionError(apiError) ? await readCachedResponse<T>(cacheKey) : null;
      if (cached !== null) return cached;
      throw apiError;
    }
  }
}
