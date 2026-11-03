import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { TextField } from '@/components/ui/TextField';
import { createHabit, updateHabit } from '@/services/api/habitApi';
import { toApiError } from '@/services/http/apiError';
import type { HabitDto } from '@/types/api';
import { validateHabitDescription, validateHabitName } from '@/utils/validation';

interface HabitFormModalProps {
  visible: boolean;
  habit: HabitDto | null;
  onClose: () => void;
  onSaved: () => void;
}

export function HabitFormModal({ visible, habit, onClose, onSaved }: HabitFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(habit?.name ?? '');
    setDescription(habit?.description ?? '');
    setNameError(null);
    setDescriptionError(null);
    setFormError(null);
  }, [visible, habit]);

  const isEditing = habit !== null;

  async function handleSubmit() {
    const nextNameError = validateHabitName(name);
    const nextDescriptionError = validateHabitDescription(description);
    setNameError(nextNameError);
    setDescriptionError(nextDescriptionError);
    if (nextNameError || nextDescriptionError) return;

    setIsSaving(true);
    setFormError(null);
    try {
      const data = { name: name.trim(), description: description.trim() };
      if (habit) {
        await updateHabit(habit.id, data);
      } else {
        await createHabit(data);
      }
      onSaved();
    } catch (error) {
      setFormError(toApiError(error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text accessibilityRole="header" style={styles.title}>
            {isEditing ? 'Ubah Kebiasaan' : 'Tambah Kebiasaan'}
          </Text>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <TextField
              label="Nama kebiasaan"
              placeholder="Contoh: Membaca 20 menit"
              value={name}
              onChangeText={setName}
              maxLength={60}
              error={nameError}
            />
            <TextField
              label="Deskripsi (opsional)"
              placeholder="Tujuan atau catatan singkat"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={200}
              error={descriptionError}
            />
            {formError ? <StatusMessage tone="error" message={formError} /> : null}
          </ScrollView>
          <View style={styles.actions}>
            <Button title="Batal" variant="secondary" onPress={onClose} disabled={isSaving} style={styles.action} />
            <Button
              title="Simpan"
              onPress={handleSubmit}
              loading={isSaving}
              style={styles.action}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 31, 23, 0.45)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  form: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  action: {
    flex: 1,
  },
});
