import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface HistoryDayRowProps {
  label: string;
  completed: number;
  total: number;
  percent: number;
}

export function HistoryDayRow({ label, completed, total, percent }: HistoryDayRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {completed}/{total} · {percent}%
        </Text>
      </View>
      <ProgressBar progress={percent} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
