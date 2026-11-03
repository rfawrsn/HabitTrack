import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, type CameraType } from 'expo-camera';
import { SwitchCamera } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { StatusMessage } from '@/components/ui/StatusMessage';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  async function handleCapture() {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    setCaptureError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        onCapture(photo.uri);
      } else {
        setCaptureError('Foto gagal diambil. Coba lagi.');
      }
    } catch {
      setCaptureError('Foto gagal diambil. Coba lagi.');
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <View style={styles.frame}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}>
        <View style={styles.overlay}>
          {captureError ? <StatusMessage tone="error" message={captureError} /> : null}
          <Text style={styles.hint}>Arahkan kamera ke kebiasaanmu</Text>
          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ganti kamera depan atau belakang"
              onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
              style={({ pressed }) => [styles.sideButton, pressed && styles.pressed]}>
              <SwitchCamera size={24} color={colors.white} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ambil foto"
              accessibilityState={{ busy: isCapturing, disabled: isCapturing }}
              disabled={isCapturing}
              onPress={handleCapture}
              style={({ pressed }) => [styles.shutter, pressed && styles.pressed]}>
              {isCapturing ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <View style={styles.shutterInner} />
              )}
            </Pressable>
            <View style={styles.sideButton} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 420,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#0F1F17',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  hint: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(15, 31, 23, 0.6)',
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15, 31, 23, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
