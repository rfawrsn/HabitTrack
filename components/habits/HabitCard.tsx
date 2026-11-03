import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Flame, Pencil, Trash2 } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import type { HabitDto } from '@/types/api';

interface HabitCardProps {
  habit: HabitDto;
  busy: boolean;
  onToggle: (habit: HabitDto) => void;
  onEdit?: (habit: HabitDto) => void;
  onDelete?: (habit: HabitDto) => void;
}

export function HabitCard({ habit, busy, onToggle, onEdit, onDelete }: HabitCardProps) {
  const showActions = Boolean(onEdit && onDelete);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={`Tandai ${habit.name} selesai hari ini`}
          accessibilityState={{ checked: habit.completedToday, busy, disabled: busy }}
          disabled={busy}
          onPress={() => onToggle(habit)}
          style={({ pressed }) => [
            styles.check,
            habit.completedToday && styles.checkDone,
            pressed && styles.pressed,
          ]}>
          {busy ? (
            <ActivityIndicator color={habit.completedToday ? colors.white : colors.primary} />
          ) : habit.completedToday ? (
            <Check size={20} color={colors.white} strokeWidth={3} />
          ) : null}
        </Pressable>

        <View style={styles.info}>
          <Text style={[styles.name, habit.completedToday && styles.nameDone]} numberOfLines={1}>
            {habit.name}
          </Text>
          {habit.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {habit.description}
            </Text>
          ) : null}
          <View style={styles.streakRow}>
            <Flame size={14} color={colors.warning} />
            <Text style={styles.streakText}>
              {habit.currentStreak > 0 ? `${habit.currentStreak} hari berturut-turut` : 'Belum ada streak'}
            </Text>
          </View>
        </View>

        {showActions && onEdit && onDelete ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ubah ${habit.name}`}
              onPress={() => onEdit(habit)}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Pencil size={18} color={colors.primaryDark} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hapus ${habit.name}`}
              onPress={() => onDelete(habit)}
              style={({ pressed }) => [styles.iconButton, styles.deleteButton, pressed && styles.pressed]}>
              <Trash2 size={18} color={colors.error} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.primary,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  nameDone: {
    color: colors.textMuted,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
  },
  pressed: {
    opacity: 0.8,
  },
});
