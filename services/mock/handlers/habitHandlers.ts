import type { HabitDto, SaveHabitDto } from '@/types/api';
import {
  createId,
  readCollection,
  StoredCompletion,
  StoredHabit,
  writeCollection,
} from '@/services/mock/mockDatabase';
import {
  asRecord,
  MockHttpError,
  MockRequest,
  MockResult,
  readOptionalText,
  readText,
  requireUserId,
} from '@/services/mock/mockRequest';
import { computeStreak } from '@/utils/habitStats';
import { todayKey } from '@/utils/date';
import {
  validateHabitDescription,
  validateHabitName,
} from '@/utils/validation';

const HABIT_NOT_FOUND_MESSAGE = 'Kebiasaan tidak ditemukan.';

export async function findOwnedHabit(userId: string, habitId: string): Promise<StoredHabit> {
  const habit = (await readCollection('habits')).find(
    (item) => item.id === habitId && item.userId === userId,
  );
  if (!habit) throw new MockHttpError(404, HABIT_NOT_FOUND_MESSAGE);
  return habit;
}

async function buildHabitDto(habit: StoredHabit): Promise<HabitDto> {
  const today = todayKey();
  const dates = new Set(
    (await readCollection('completions'))
      .filter((completion) => completion.habitId === habit.id)
      .map((completion) => completion.date),
  );
  return {
    id: habit.id,
    name: habit.name,
    description: habit.description,
    createdAt: habit.createdAt,
    completedToday: dates.has(today),
    currentStreak: computeStreak(dates, today),
  };
}

function readHabitInput(body: unknown): SaveHabitDto {
  const record = asRecord(body);
  const name = readText(record, 'name').trim();
  const description = (readOptionalText(record, 'description') ?? '').trim();
  const validationError = validateHabitName(name) ?? validateHabitDescription(description);
  if (validationError) throw new MockHttpError(400, validationError);
  return { name, description };
}

export async function listHabits(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const habits = (await readCollection('habits'))
    .filter((habit) => habit.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const data = await Promise.all(habits.map(buildHabitDto));
  return { status: 200, data };
}

export async function createHabit(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const input = readHabitInput(request.body);
  const habit: StoredHabit = {
    id: createId(),
    userId,
    name: input.name,
    description: input.description,
    createdAt: new Date().toISOString(),
  };
  await writeCollection('habits', [...(await readCollection('habits')), habit]);
  return { status: 201, data: await buildHabitDto(habit) };
}

export async function updateHabit(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const existing = await findOwnedHabit(userId, request.params.id);
  const input = readHabitInput(request.body);
  const updated: StoredHabit = { ...existing, name: input.name, description: input.description };
  const habits = await readCollection('habits');
  await writeCollection(
    'habits',
    habits.map((habit) => (habit.id === updated.id ? updated : habit)),
  );
  return { status: 200, data: await buildHabitDto(updated) };
}

export async function deleteHabit(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const habit = await findOwnedHabit(userId, request.params.id);

  await writeCollection(
    'habits',
    (await readCollection('habits')).filter((item) => item.id !== habit.id),
  );
  await writeCollection(
    'completions',
    (await readCollection('completions')).filter((item) => item.habitId !== habit.id),
  );
  await writeCollection(
    'photos',
    (await readCollection('photos')).map((photo) =>
      photo.habitId === habit.id ? { ...photo, habitId: null } : photo,
    ),
  );
  return { status: 204 };
}

export async function completeHabitToday(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const habit = await findOwnedHabit(userId, request.params.id);
  const today = todayKey();
  const completions = await readCollection('completions');
  if (completions.some((item) => item.habitId === habit.id && item.date === today)) {
    throw new MockHttpError(409, 'Kebiasaan sudah ditandai selesai hari ini.');
  }
  const completion: StoredCompletion = { id: createId(), habitId: habit.id, date: today };
  await writeCollection('completions', [...completions, completion]);
  return { status: 201, data: await buildHabitDto(habit) };
}

export async function uncompleteHabitToday(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const habit = await findOwnedHabit(userId, request.params.id);
  const today = todayKey();
  const completions = await readCollection('completions');
  const remaining = completions.filter(
    (item) => !(item.habitId === habit.id && item.date === today),
  );
  if (remaining.length === completions.length) {
    throw new MockHttpError(404, 'Kebiasaan belum ditandai selesai hari ini.');
  }
  await writeCollection('completions', remaining);
  return { status: 200, data: await buildHabitDto(habit) };
}
