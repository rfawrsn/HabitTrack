import type { AuthResponseDto, UserDto } from '@/types/api';
import { createSalt, createSessionToken, hashPassword } from '@/services/mock/security';
import {
  createId,
  readCollection,
  StoredSession,
  StoredUser,
  writeCollection,
} from '@/services/mock/mockDatabase';
import {
  asRecord,
  MockHttpError,
  MockRequest,
  MockResult,
  readText,
  requireUserId,
} from '@/services/mock/mockRequest';
import {
  validateEmail,
  validateName,
  validatePassword,
  validateRequiredPassword,
} from '@/utils/validation';

const INVALID_CREDENTIALS_MESSAGE = 'Email atau kata sandi salah.';

function toUserDto(user: StoredUser): UserDto {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

async function issueSession(userId: string): Promise<string> {
  const token = await createSessionToken();
  const sessions = await readCollection('sessions');
  const session: StoredSession = { token, userId, createdAt: new Date().toISOString() };
  await writeCollection('sessions', [...sessions, session]);
  return token;
}

export async function registerUser(request: MockRequest): Promise<MockResult> {
  const record = asRecord(request.body);
  const name = readText(record, 'name').trim();
  const email = readText(record, 'email').trim().toLowerCase();
  const password = readText(record, 'password');

  const validationError = validateName(name) ?? validateEmail(email) ?? validatePassword(password);
  if (validationError) throw new MockHttpError(400, validationError);

  const users = await readCollection('users');
  if (users.some((user) => user.email === email)) {
    throw new MockHttpError(409, 'Email ini sudah terdaftar.');
  }

  const salt = await createSalt();
  const user: StoredUser = {
    id: createId(),
    name,
    email,
    passwordSalt: salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  await writeCollection('users', [...users, user]);

  const response: AuthResponseDto = { token: await issueSession(user.id), user: toUserDto(user) };
  return { status: 201, data: response };
}

export async function loginUser(request: MockRequest): Promise<MockResult> {
  const record = asRecord(request.body);
  const email = readText(record, 'email').trim().toLowerCase();
  const password = readText(record, 'password');

  const validationError = validateEmail(email) ?? validateRequiredPassword(password);
  if (validationError) throw new MockHttpError(400, validationError);

  const user = (await readCollection('users')).find((item) => item.email === email);
  if (!user || (await hashPassword(password, user.passwordSalt)) !== user.passwordHash) {
    throw new MockHttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const response: AuthResponseDto = { token: await issueSession(user.id), user: toUserDto(user) };
  return { status: 200, data: response };
}

export async function getCurrentUser(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const user = (await readCollection('users')).find((item) => item.id === userId);
  if (!user) throw new MockHttpError(401, 'Sesi Anda telah berakhir. Silakan masuk kembali.');
  return { status: 200, data: toUserDto(user) };
}

export async function logoutUser(request: MockRequest): Promise<MockResult> {
  const sessions = await readCollection('sessions');
  await writeCollection(
    'sessions',
    sessions.filter((session) => session.token !== request.token),
  );
  return { status: 204 };
}
