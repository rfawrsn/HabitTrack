import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListChecks, Plus } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';
import { deleteHabit } from '@/services/api/habitApi';
import { toApiError } from '@/services/http/apiError';
import type { HabitDto } from '@/types/api';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitFormModal } from '@/components/habits/HabitFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusMessage } from '@/components/ui/StatusMessage';

export default function HabitsScreen() {
  const { habits, status, errorMessage, actionError, busyHabitId, reload, toggleToday } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitDto | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<HabitDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreateForm() {
    setEditingHabit(null);
    setIsFormOpen(true);
  }

  function openEditForm(habit: HabitDto) {
    setEditingHabit(habit);
    setIsFormOpen(true);
  }

  function closeDeleteDialog() {
    setDeletingHabit(null);
    setDeleteError(null);
  }

  async function handleDelete() {
    if (!deletingHabit) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteHabit(deletingHabit.id);
      closeDeleteDialog();
      await reload();
    } catch (error) {
      setDeleteError(toApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaved() {
    setIsFormOpen(false);
    reload();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Kebiasaan"
        subtitle="Kelola daftar kebiasaanmu"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah kebiasaan baru"
            onPress={openCreateForm}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addLabel}>Tambah</Text>
          </Pressable>
        }
      />

      {actionError ? (
        <View style={styles.banner}>
          <StatusMessage tone="error" message={actionError} />
        </View>
      ) : null}

      {status === 'loading' ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

      {status === 'error' ? (
        <View style={styles.banner}>
          <ErrorState message={errorMessage ?? 'Gagal memuat kebiasaan.'} onRetry={reload} />
        </View>
      ) : null}

      {status === 'success' && habits.length === 0 ? (
        <View style={styles.banner}>
          <EmptyState
            icon={ListChecks}
            title="Belum ada kebiasaan"
            description="Buat kebiasaan pertamamu dan mulai lacak progresnya setiap hari."
            actionLabel="Tambah kebiasaan"
            onAction={openCreateForm}
          />
        </View>
      ) : null}

      {status === 'success' && habits.length > 0 ? (
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              busy={busyHabitId === item.id}
              onToggle={toggleToday}
              onEdit={openEditForm}
              onDelete={setDeletingHabit}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : null}

      <HabitFormModal
        visible={isFormOpen}
        habit={editingHabit}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        visible={deletingHabit !== null}
        title="Hapus kebiasaan?"
        message={`"${deletingHabit?.name ?? ''}" dan riwayat penyelesaiannya akan dihapus permanen.`}
        confirmLabel="Hapus"
        loading={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  banner: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  loader: {
    marginTop: spacing.lg,
  },
  list: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  separator: {
    height: spacing.xs,
  },
});
