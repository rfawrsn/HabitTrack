import { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ListChecks } from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { DailyProgressCard } from '@/components/home/DailyProgressCard';
import { HabitCard } from '@/components/habits/HabitCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { formatLongDate, greetingForHour, todayKey } from '@/utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { habits, status, errorMessage, actionError, busyHabitId, reload, toggleToday } = useHabits();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const completed = habits.filter((habit) => habit.completedToday).length;
  const firstName = user?.name.split(' ')[0] ?? '';

  async function handleRefresh() {
    setIsRefreshing(true);
    await reload();
    setIsRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}>
        <ScreenHeader
          title={`${greetingForHour(new Date().getHours())}, ${firstName}`}
          subtitle={formatLongDate(todayKey())}
        />

        {status === 'success' || habits.length > 0 ? (
          <DailyProgressCard completed={completed} total={habits.length} />
        ) : null}

        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Kebiasaan hari ini
        </Text>

        {status === 'loading' ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : null}

        {status === 'error' ? (
          <ErrorState message={errorMessage ?? 'Gagal memuat kebiasaan.'} onRetry={reload} />
        ) : null}

        {status === 'success' && habits.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Belum ada kebiasaan"
            description="Tambahkan kebiasaan pertamamu, misalnya minum air atau membaca buku."
            actionLabel="Tambah kebiasaan"
            onAction={() => router.navigate('/habits')}
          />
        ) : null}

        {actionError ? <StatusMessage tone="error" message={actionError} /> : null}

        {status === 'success' && habits.length > 0 ? (
          <View style={styles.list}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                busy={busyHabitId === habit.id}
                onToggle={toggleToday}
              />
            ))}
            <Button title="Kelola kebiasaan" variant="secondary" onPress={() => router.navigate('/habits')} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  loader: {
    marginVertical: spacing.md,
  },
  list: {
    gap: spacing.xs,
  },
});
