import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { StatusMessage } from '@/components/ui/StatusMessage';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  loading = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onCancel} />
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          {errorMessage ? <StatusMessage tone="error" message={errorMessage} /> : null}
          <View style={styles.actions}>
            <Button title="Batal" variant="secondary" onPress={onCancel} disabled={loading} style={styles.action} />
            <Button
              title={confirmLabel}
              variant="danger"
              onPress={onConfirm}
              loading={loading}
              style={styles.action}
            />
          </View>
          {loading ? <ActivityIndicator color={colors.primary} style={styles.spinner} /> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 31, 23, 0.45)',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  action: {
    flex: 1,
  },
  spinner: {
    alignSelf: 'center',
  },
});
