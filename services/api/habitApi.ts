import { apiRequest } from '@/services/http/apiClient';
import type { HabitDto, SaveHabitDto } from '@/types/api';

export function fetchHabits(): Promise<HabitDto[]> {
  return apiRequest<HabitDto[]>({ method: 'GET', url: '/habits' });
}

export function createHabit(data: SaveHabitDto): Promise<HabitDto> {
  return apiRequest<HabitDto>({ method: 'POST', url: '/habits', data });
}

export function updateHabit(habitId: string, data: SaveHabitDto): Promise<HabitDto> {
  return apiRequest<HabitDto>({ method: 'PUT', url: `/habits/${habitId}`, data });
}

export function deleteHabit(habitId: string): Promise<void> {
  return apiRequest<void>({ method: 'DELETE', url: `/habits/${habitId}` });
}

export function completeHabitToday(habitId: string): Promise<HabitDto> {
  return apiRequest<HabitDto>({ method: 'POST', url: `/habits/${habitId}/completions` });
}

export function uncompleteHabitToday(habitId: string): Promise<HabitDto> {
  return apiRequest<HabitDto>({ method: 'DELETE', url: `/habits/${habitId}/completions` });
}
