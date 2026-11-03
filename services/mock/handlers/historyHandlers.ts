import type { HistoryDayDto, HistoryResponseDto } from '@/types/api';
import { readCollection, StoredCompletion, StoredHabit } from '@/services/mock/mockDatabase';
import { MockRequest, MockResult, requireUserId } from '@/services/mock/mockRequest';
import { computeLongestStreak, computeStreak, percentOf } from '@/utils/habitStats';
import { addDaysToKey, todayKey } from '@/utils/date';

const DEFAULT_HISTORY_DAYS = 30;
const MAX_HISTORY_DAYS = 90;

export async function getHistory(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const requestedDays = Number(request.query.days);
  const days = Number.isFinite(requestedDays)
    ? Math.min(Math.max(Math.round(requestedDays), 1), MAX_HISTORY_DAYS)
    : DEFAULT_HISTORY_DAYS;

  const habits = (await readCollection('habits')).filter(
    (habit: StoredHabit) => habit.userId === userId,
  );
  const habitIds = new Set(habits.map((habit) => habit.id));
  const completions = (await readCollection('completions')).filter(
    (completion: StoredCompletion) => habitIds.has(completion.habitId),
  );

  const completedByDate = new Map<string, number>();
  for (const completion of completions) {
    completedByDate.set(completion.date, (completedByDate.get(completion.date) ?? 0) + 1);
  }

  const today = todayKey();
  const dayList: HistoryDayDto[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const date = addDaysToKey(today, -offset);
    const completedCount = completedByDate.get(date) ?? 0;
    dayList.push({
      date,
      completedCount,
      totalHabits: habits.length,
      percent: percentOf(completedCount, habits.length),
    });
  }

  const activeDates = [...completedByDate.keys()];
  const response: HistoryResponseDto = {
    summary: {
      currentStreak: computeStreak(new Set(activeDates), today),
      longestStreak: computeLongestStreak(activeDates),
      activeDays: activeDates.length,
    },
    days: dayList,
  };
  return { status: 200, data: response };
}
