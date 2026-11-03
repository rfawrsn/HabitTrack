import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface AuthScaffoldProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthScaffold({ title, subtitle, children }: AuthScaffoldProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Leaf size={28} color={colors.white} />
            </View>
            <Text style={styles.appName}>HabitTrack</Text>
            <Text style={styles.tagline}>Bangun kebiasaan baik setiap hari</Text>
          </View>
          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.form}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.sm,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    gap: spacing.md,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  tagline: {
    fontSize: 15,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F1F17',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  form: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
