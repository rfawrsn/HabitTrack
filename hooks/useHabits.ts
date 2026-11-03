import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  completeHabitToday,
  fetchHabits,
  uncompleteHabitToday,
} from '@/services/api/habitApi';
import { toApiError } from '@/services/http/apiError';
import type { HabitDto } from '@/types/api';

type LoadStatus = 'loading' | 'success' | 'error';

export function useHabits() {
  const [habits, setHabits] = useState<HabitDto[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyHabitId, setBusyHabitId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setHabits(await fetchHabits());
      setErrorMessage(null);
      setStatus('success');
    } catch (error) {
      setErrorMessage(toApiError(error).message);
      setStatus('error');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const toggleToday = useCallback(
    async (habit: HabitDto) => {
      setBusyHabitId(habit.id);
      setActionError(null);
      try {
        if (habit.completedToday) {
          await uncompleteHabitToday(habit.id);
        } else {
          await completeHabitToday(habit.id);
        }
      } catch (error) {
        setActionError(toApiError(error).message);
      } finally {
        await reload();
        setBusyHabitId(null);
      }
    },
    [reload],
  );

  return { habits, status, errorMessage, actionError, busyHabitId, reload, toggleToday };
}
