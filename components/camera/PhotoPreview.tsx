import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import type { HabitDto } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { TextField } from '@/components/ui/TextField';
import { validateCaption } from '@/utils/validation';

export interface PhotoDetails {
  caption: string;
  habitId: string | null;
}

interface PhotoPreviewProps {
  uri: string;
  habits: HabitDto[];
  isSaving: boolean;
  errorMessage: string | null;
  onRetake: () => void;
  onSave: (details: PhotoDetails) => void;
}

export function PhotoPreview({ uri, habits, isSaving, errorMessage, onRetake, onSave }: PhotoPreviewProps) {
  const [caption, setCaption] = useState('');
  const [habitId, setHabitId] = useState<string | null>(null);
  const [captionError, setCaptionError] = useState<string | null>(null);

  function handleSave() {
    const error = validateCaption(caption);
    setCaptionError(error);
    if (error) return;
    onSave({ caption: caption.trim(), habitId });
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image accessibilityLabel="Pratinjau foto" source={{ uri }} style={styles.photo} resizeMode="cover" />

      <Card style={styles.details}>
        <TextField
          label="Keterangan (opsional)"
          placeholder="Contoh: Sesi belajar di perpustakaan"
          value={caption}
          onChangeText={setCaption}
          maxLength={120}
          error={captionError}
        />

        <Text style={styles.label}>Kaitkan dengan kebiasaan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <HabitChip label="Tanpa kebiasaan" selected={habitId === null} onPress={() => setHabitId(null)} />
          {habits.map((habit) => (
            <HabitChip
              key={habit.id}
              label={habit.name}
              selected={habitId === habit.id}
              onPress={() => setHabitId(habit.id)}
            />
          ))}
        </ScrollView>

        {errorMessage ? <StatusMessage tone="error" message={errorMessage} /> : null}
      </Card>

      <View style={styles.actions}>
        <Button title="Ulangi" variant="secondary" onPress={onRetake} disabled={isSaving} style={styles.action} />
        <Button title="Simpan foto" onPress={handleSave} loading={isSaving} style={styles.action} />
      </View>
    </ScrollView>
  );
}

interface HabitChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function HabitChip({ label, selected, onPress }: HabitChipProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  details: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chips: {
    gap: spacing.xs,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    maxWidth: 220,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  action: {
    flex: 1,
  },
});
