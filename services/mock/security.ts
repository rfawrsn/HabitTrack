import * as Crypto from 'expo-crypto';

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSalt(): Promise<string> {
  return toHex(await Crypto.getRandomBytesAsync(16));
}

export async function createSessionToken(): Promise<string> {
  return toHex(await Crypto.getRandomBytesAsync(32));
}

export function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}
