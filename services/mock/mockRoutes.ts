import { getCurrentUser, loginUser, logoutUser, registerUser } from '@/services/mock/handlers/authHandlers';
import {
  completeHabitToday,
  createHabit,
  deleteHabit,
  listHabits,
  uncompleteHabitToday,
  updateHabit,
} from '@/services/mock/handlers/habitHandlers';
import { getHistory } from '@/services/mock/handlers/historyHandlers';
import { createPhoto, deletePhoto, listPhotos } from '@/services/mock/handlers/photoHandlers';
import { MockRequest, MockResult } from '@/services/mock/mockRequest';

export interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (request: MockRequest) => Promise<MockResult>;
}

export const MOCK_ROUTES: MockRoute[] = [
  { method: 'POST', path: '/auth/register', handler: registerUser },
  { method: 'POST', path: '/auth/login', handler: loginUser },
  { method: 'GET', path: '/auth/me', handler: getCurrentUser },
  { method: 'POST', path: '/auth/logout', handler: logoutUser },
  { method: 'GET', path: '/habits', handler: listHabits },
  { method: 'POST', path: '/habits', handler: createHabit },
  { method: 'PUT', path: '/habits/:id', handler: updateHabit },
  { method: 'DELETE', path: '/habits/:id', handler: deleteHabit },
  { method: 'POST', path: '/habits/:id/completions', handler: completeHabitToday },
  { method: 'DELETE', path: '/habits/:id/completions', handler: uncompleteHabitToday },
  { method: 'GET', path: '/history', handler: getHistory },
  { method: 'GET', path: '/photos', handler: listPhotos },
  { method: 'POST', path: '/photos', handler: createPhoto },
  { method: 'DELETE', path: '/photos/:id', handler: deletePhoto },
];
