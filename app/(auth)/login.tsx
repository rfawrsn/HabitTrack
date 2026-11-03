import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { Button } from '@/components/ui/Button';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthContext';
import { toApiError } from '@/services/http/apiError';
import { colors, spacing } from '@/constants/theme';
import { validateEmail, validateRequiredPassword } from '@/utils/validation';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequiredPassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setFormError(toApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScaffold title="Masuk" subtitle="Lanjutkan kebiasaanmu hari ini.">
      <TextField
        label="Email"
        placeholder="nama@kampus.ac.id"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={emailError}
      />
      <TextField
        label="Kata sandi"
        placeholder="Masukkan kata sandi"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        error={passwordError}
      />
      {formError ? <StatusMessage tone="error" message={formError} /> : null}
      <Button title="Masuk" onPress={handleSubmit} loading={isSubmitting} />
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Belum punya akun?</Text>
        <Link href="/register" style={styles.switchLink} accessibilityRole="link">
          Daftar
        </Link>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  switchText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  switchLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
