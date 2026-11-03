import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
}

export interface StoredHabit {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface StoredCompletion {
  id: string;
  habitId: string;
  date: string;
}

export interface StoredPhoto {
  id: string;
  userId: string;
  uri: string;
  caption: string;
  habitId: string | null;
  createdAt: string;
}

interface CollectionRecords {
  users: StoredUser;
  sessions: StoredSession;
  habits: StoredHabit;
  completions: StoredCompletion;
  photos: StoredPhoto;
}

export type CollectionName = keyof CollectionRecords;

const STORAGE_PREFIX = 'habittrack:mock:';

export async function readCollection<K extends CollectionName>(
  name: K,
): Promise<CollectionRecords[K][]> {
  const raw = await AsyncStorage.getItem(`${STORAGE_PREFIX}${name}`);
  return raw === null ? [] : (JSON.parse(raw) as CollectionRecords[K][]);
}

export async function writeCollection<K extends CollectionName>(
  name: K,
  records: CollectionRecords[K][],
): Promise<void> {
  await AsyncStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(records));
}

export function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
