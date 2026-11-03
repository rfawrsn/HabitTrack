import axios from 'axios';
import type { ApiErrorBody } from '@/types/api';

export type ApiErrorCode = 'OFFLINE' | 'TIMEOUT' | 'NETWORK' | 'HTTP';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;

  constructor(code: ApiErrorCode, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Data yang dikirim tidak valid.',
  401: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
  403: 'Anda tidak memiliki akses ke data ini.',
  404: 'Data tidak ditemukan.',
  409: 'Data sudah ada.',
  429: 'Terlalu banyak permintaan. Coba lagi sebentar.',
};

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError('NETWORK', 'Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    }
    const status = error.response.status;
    const body = error.response.data as Partial<ApiErrorBody> | undefined;
    const fallback = status >= 500 ? 'Server sedang bermasalah. Coba lagi nanti.' : 'Terjadi kesalahan. Coba lagi.';
    return new ApiError('HTTP', body?.message ?? STATUS_MESSAGES[status] ?? fallback, status);
  }
  return new ApiError('NETWORK', 'Terjadi kesalahan tak terduga.');
}

export function isConnectionError(error: ApiError): boolean {
  return error.code === 'TIMEOUT' || error.code === 'NETWORK';
}

export function isRetryableError(error: ApiError): boolean {
  return isConnectionError(error) || (error.status !== null && error.status >= 500);
}
