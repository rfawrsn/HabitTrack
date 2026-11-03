import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Halaman tidak ditemukan' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Halaman tidak ditemukan</Text>
        <Text style={styles.description}>Halaman yang Anda cari tidak tersedia.</Text>
        <Button title="Kembali ke beranda" onPress={() => router.replace('/')} style={styles.action} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.xs,
    minWidth: 220,
  },
});
