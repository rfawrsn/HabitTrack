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
import { validateEmail, validateName, validatePassword } from '@/utils/validation';

interface FieldErrors {
  name: string | null;
  email: string | null;
  password: string | null;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ name: null, email: null, password: null });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.password) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
      setFormError(toApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScaffold title="Buat akun" subtitle="Daftar untuk mulai melacak kebiasaanmu.">
      <TextField
        label="Nama lengkap"
        placeholder="Nama kamu"
        value={name}
        onChangeText={setName}
        autoComplete="name"
        textContentType="name"
        error={errors.name}
      />
      <TextField
        label="Email"
        placeholder="nama@kampus.ac.id"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.email}
      />
      <TextField
        label="Kata sandi"
        placeholder="Minimal 8 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        error={errors.password}
      />
      <Text style={styles.hint}>Gunakan kombinasi huruf dan angka.</Text>
      {formError ? <StatusMessage tone="error" message={formError} /> : null}
      <Button title="Daftar" onPress={handleSubmit} loading={isSubmitting} />
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Sudah punya akun?</Text>
        <Link href="/login" style={styles.switchLink} accessibilityRole="link">
          Masuk
        </Link>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
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
