export interface ApiErrorBody {
  message: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface HabitDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  completedToday: boolean;
  currentStreak: number;
}

export interface SaveHabitDto {
  name: string;
  description: string;
}

export interface HistoryDayDto {
  date: string;
  completedCount: number;
  totalHabits: number;
  percent: number;
}

export interface HistorySummaryDto {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
}

export interface HistoryResponseDto {
  summary: HistorySummaryDto;
  days: HistoryDayDto[];
}

export interface PhotoDto {
  id: string;
  uri: string;
  caption: string;
  habitId: string | null;
  habitName: string | null;
  createdAt: string;
}

export interface CreatePhotoDto {
  uri: string;
  caption: string;
  habitId: string | null;
}
