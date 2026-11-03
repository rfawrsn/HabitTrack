import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isRestoring } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    if (isRestoring) return;
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [isRestoring, user, inAuthGroup, router]);

  if (isRestoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
