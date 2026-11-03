import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { StatusMessage } from '@/components/ui/StatusMessage';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <StatusMessage tone="error" message={message} />
      <Button title="Coba lagi" onPress={onRetry} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
