import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function TextField({ label, error, multiline, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multiline,
          error ? styles.inputError : null,
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 96,
    paddingTop: spacing.xs + 4,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: 14,
    color: colors.error,
  },
});
