import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, Flame } from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';
import { useHistory } from '@/hooks/useHistory';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatTile } from '@/components/ui/StatTile';
import { formatHistoryLabel, todayKey } from '@/utils/date';
import { HistoryDayRow } from '@/components/history/HistoryDayRow';

export default function HistoryScreen() {
  const history = useHistory();
  const habits = useHabits();

  const isLoading = history.status === 'loading' || habits.status === 'loading';
  const loadError = history.status === 'error' ? history.errorMessage : null;
  const hasNoHabits = habits.status === 'success' && habits.habits.length === 0;

  function reloadAll() {
    history.reload();
    habits.reload();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Riwayat" subtitle="Progres dan streak 30 hari terakhir" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

        {loadError ? <ErrorState message={loadError} onRetry={reloadAll} /> : null}

        {hasNoHabits ? (
          <EmptyState
            icon={CalendarDays}
            title="Belum ada riwayat"
            description="Riwayat progres akan muncul setelah kamu menambahkan dan menyelesaikan kebiasaan."
          />
        ) : null}

        {history.status === 'success' && history.history && !hasNoHabits ? (
          <>
            <View style={styles.statRow}>
              <StatTile label="Streak saat ini" value={`${history.history.summary.currentStreak} hari`} />
              <StatTile label="Streak terbaik" value={`${history.history.summary.longestStreak} hari`} />
              <StatTile label="Hari aktif" value={`${history.history.summary.activeDays}`} />
            </View>

            {habits.habits.length > 0 ? (
              <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Streak per kebiasaan</Text>
                {habits.habits.map((habit) => (
                  <View key={habit.id} style={styles.habitRow}>
                    <Text style={styles.habitName} numberOfLines={1}>
                      {habit.name}
                    </Text>
                    <View style={styles.habitStreak}>
                      <Flame size={14} color={colors.warning} />
                      <Text style={styles.habitStreakText}>{habit.currentStreak} hari</Text>
                    </View>
                  </View>
                ))}
              </Card>
            ) : null}

            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Progres harian</Text>
              {history.history.days.map((day) => (
                <HistoryDayRow
                  key={day.date}
                  label={formatHistoryLabel(day.date, todayKey())}
                  completed={day.completedCount}
                  total={day.totalHabits}
                  percent={day.percent}
                />
              ))}
            </Card>
          </>
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
  loader: {
    marginTop: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  section: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  habitName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  habitStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  habitStreakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
