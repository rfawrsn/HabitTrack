import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

interface StatTileProps {
  label: string;
  value: string;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <Card style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
