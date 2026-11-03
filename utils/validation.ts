const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string): string | null {
  const name = value.trim();
  if (name.length === 0) return 'Nama wajib diisi.';
  if (name.length < 2) return 'Nama minimal 2 karakter.';
  if (name.length > 50) return 'Nama maksimal 50 karakter.';
  return null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (email.length === 0) return 'Email wajib diisi.';
  if (!EMAIL_PATTERN.test(email)) return 'Format email tidak valid.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length === 0) return 'Kata sandi wajib diisi.';
  if (value.length < 8) return 'Kata sandi minimal 8 karakter.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Kata sandi harus memuat huruf dan angka.';
  }
  return null;
}

export function validateRequiredPassword(value: string): string | null {
  return value.length === 0 ? 'Kata sandi wajib diisi.' : null;
}

export function validateHabitName(value: string): string | null {
  const name = value.trim();
  if (name.length === 0) return 'Nama kebiasaan wajib diisi.';
  if (name.length > 60) return 'Nama kebiasaan maksimal 60 karakter.';
  return null;
}

export function validateHabitDescription(value: string): string | null {
  return value.trim().length > 200 ? 'Deskripsi maksimal 200 karakter.' : null;
}

export function validateCaption(value: string): string | null {
  return value.trim().length > 120 ? 'Keterangan maksimal 120 karakter.' : null;
}
