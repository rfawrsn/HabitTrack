import { apiRequest } from '@/services/http/apiClient';
import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserDto,
} from '@/types/api';

export function registerAccount(data: RegisterRequestDto): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>({ method: 'POST', url: '/auth/register', data });
}

export function loginAccount(data: LoginRequestDto): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>({ method: 'POST', url: '/auth/login', data });
}

export function fetchCurrentUser(): Promise<UserDto> {
  return apiRequest<UserDto>({ method: 'GET', url: '/auth/me' });
}

export function logoutAccount(): Promise<void> {
  return apiRequest<void>({ method: 'POST', url: '/auth/logout' });
}
