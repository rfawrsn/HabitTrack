import { apiRequest } from '@/services/http/apiClient';
import type { HistoryResponseDto } from '@/types/api';

export function fetchHistory(days: number): Promise<HistoryResponseDto> {
  return apiRequest<HistoryResponseDto>({ method: 'GET', url: '/history', params: { days } });
}
