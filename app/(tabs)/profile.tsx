import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { useHistory } from '@/hooks/useHistory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatTile } from '@/components/ui/StatTile';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { formatMonthYear } from '@/utils/date';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const habits = useHabits();
  const history = useHistory();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const initial = user?.name.charAt(0).toUpperCase() ?? '?';
  const statsError = habits.errorMessage ?? history.errorMessage;

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError('Gagal keluar. Coba lagi.');
      setIsLoggingOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Profil" subtitle="Akun dan ringkasan aktivitasmu" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user ? <Text style={styles.joined}>Bergabung sejak {formatMonthYear(user.createdAt)}</Text> : null}
        </Card>

        <View style={styles.statRow}>
          <StatTile label="Kebiasaan aktif" value={`${habits.habits.length}`} />
          <StatTile label="Streak terbaik" value={`${history.history?.summary.longestStreak ?? 0} hari`} />
        </View>

        {statsError ? <StatusMessage tone="error" message={statsError} /> : null}

        {logoutError ? <StatusMessage tone="error" message={logoutError} /> : null}

        <Button
          title="Keluar"
          variant="danger"
          onPress={handleLogout}
          loading={isLoggingOut}
          style={styles.logoutButton}
        />
        <View style={styles.logoutHint}>
          <LogOut size={14} color={colors.textMuted} />
          <Text style={styles.logoutHintText}>Sesi di perangkat ini akan dihapus.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 15,
    color: colors.textMuted,
  },
  joined: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.xs,
  },
  logoutHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoutHintText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
