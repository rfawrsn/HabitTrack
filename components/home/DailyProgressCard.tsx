import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { percentOf } from '@/utils/habitStats';

interface DailyProgressCardProps {
  completed: number;
  total: number;
}

export function DailyProgressCard({ completed, total }: DailyProgressCardProps) {
  const percent = percentOf(completed, total);
  const summary =
    total === 0
      ? 'Tambahkan kebiasaan untuk mulai melacak progres.'
      : `${completed} dari ${total} kebiasaan selesai hari ini`;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>Progres hari ini</Text>
      <View style={styles.valueRow}>
        <Text style={styles.percent}>{percent}%</Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>
      <ProgressBar progress={percent} fillColor={colors.primary} trackColor={colors.primaryLight} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  percent: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.primaryDark,
    lineHeight: 48,
  },
  summary: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingBottom: 6,
  },
});
