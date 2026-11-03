import { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { Camera, CameraOff } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';
import { createPhoto } from '@/services/api/photoApi';
import { persistPhotoFile } from '@/services/files/photoFiles';
import { toApiError } from '@/services/http/apiError';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { PhotoPreview, type PhotoDetails } from '@/components/camera/PhotoPreview';

export function CaptureSection() {
  const [permission, requestPermission] = useCameraPermissions();
  const { habits } = useHabits();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (Platform.OS === 'web') {
    return (
      <EmptyState
        icon={CameraOff}
        title="Kamera belum tersedia di browser"
        description="Buka HabitTrack di HP Android melalui Expo Go untuk mengambil foto kebiasaan."
      />
    );
  }

  if (!permission) {
    return <ActivityIndicator color={colors.primary} style={styles.loader} />;
  }

  if (!permission.granted) {
    return (
      <Card style={styles.permissionCard}>
        <View style={styles.iconWrap}>
          <Camera size={28} color={colors.primary} />
        </View>
        <Text style={styles.permissionTitle}>Izinkan akses kamera</Text>
        <Text style={styles.permissionText}>
          Kamera digunakan hanya untuk memotret dokumentasi kebiasaanmu.
        </Text>
        {permission.canAskAgain ? (
          <Button title="Izinkan kamera" onPress={requestPermission} />
        ) : (
          <StatusMessage
            tone="error"
            message="Akses kamera ditolak. Aktifkan izin kamera HabitTrack di pengaturan HP Anda."
          />
        )}
      </Card>
    );
  }

  async function handleSave({ caption, habitId }: PhotoDetails) {
    if (!capturedUri) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const storedUri = await persistPhotoFile(capturedUri);
      await createPhoto({ uri: storedUri, caption, habitId });
      setCapturedUri(null);
      setSavedMessage('Foto berhasil disimpan ke galeri.');
    } catch (error) {
      setSaveError(toApiError(error).message);
    } finally {
      setIsSaving(false);
    }
  }

  if (capturedUri) {
    return (
      <PhotoPreview
        uri={capturedUri}
        habits={habits}
        isSaving={isSaving}
        errorMessage={saveError}
        onRetake={() => {
          setSaveError(null);
          setCapturedUri(null);
        }}
        onSave={handleSave}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {savedMessage ? <StatusMessage tone="success" message={savedMessage} /> : null}
      <CameraCapture
        onCapture={(uri) => {
          setSavedMessage(null);
          setCapturedUri(uri);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  loader: {
    marginTop: spacing.lg,
  },
  permissionCard: {
    margin: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  permissionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
