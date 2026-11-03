import { addDaysToKey } from '@/utils/date';

export function computeStreak(activeDates: Set<string>, today: string): number {
  let cursor = activeDates.has(today) ? today : addDaysToKey(today, -1);
  let streak = 0;
  while (activeDates.has(cursor)) {
    streak += 1;
    cursor = addDaysToKey(cursor, -1);
  }
  return streak;
}

export function computeLongestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort();
  let longest = 0;
  let current = 0;
  let previous: string | null = null;
  for (const date of sorted) {
    current = previous !== null && addDaysToKey(previous, 1) === date ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = date;
  }
  return longest;
}

export function percentOf(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}
