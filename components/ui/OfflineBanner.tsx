import { StyleSheet, Text, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <WifiOff size={18} color={colors.warning} />
      <Text style={styles.text}>
        Anda sedang offline. Data yang ditampilkan berasal dari penyimpanan lokal.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.sm,
    marginTop: spacing.xs,
    padding: spacing.xs + 4,
    borderRadius: radius.md,
    backgroundColor: colors.warningLight,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
});
