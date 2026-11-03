import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'habittrack:cache:';

export function buildCacheKey(url: string, params: unknown): string {
  return `${CACHE_PREFIX}${url}?${JSON.stringify(params ?? {})}`;
}

export async function readCachedResponse<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw === null ? null : (JSON.parse(raw) as T);
}

export async function writeCachedResponse(key: string, data: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function clearCachedResponses(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith(CACHE_PREFIX)));
}
