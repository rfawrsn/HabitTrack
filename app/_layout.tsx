import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthGate } from '@/components/auth/AuthGate';
import { AuthProvider } from '@/context/AuthContext';
import { colors } from '@/constants/theme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthGate>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
