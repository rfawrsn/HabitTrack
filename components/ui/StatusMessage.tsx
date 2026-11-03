import { StyleSheet, Text, View } from 'react-native';
import { CircleAlert, CircleCheck } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';

type MessageTone = 'error' | 'success';

interface StatusMessageProps {
  tone: MessageTone;
  message: string;
}

const TONE_STYLES: Record<MessageTone, { background: string; text: string }> = {
  error: { background: colors.errorLight, text: colors.error },
  success: { background: colors.successLight, text: colors.primaryDark },
};

export function StatusMessage({ tone, message }: StatusMessageProps) {
  const palette = TONE_STYLES[tone];
  const Icon = tone === 'error' ? CircleAlert : CircleCheck;

  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      style={[styles.container, { backgroundColor: palette.background }]}>
      <Icon size={18} color={palette.text} />
      <Text style={[styles.text, { color: palette.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    padding: spacing.xs + 4,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
