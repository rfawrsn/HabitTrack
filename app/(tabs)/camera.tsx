import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CaptureSection } from '@/components/camera/CaptureSection';
import { PhotoGallery } from '@/components/camera/PhotoGallery';

type CameraMode = 'capture' | 'gallery';

export default function CameraScreen() {
  const [mode, setMode] = useState<CameraMode>('capture');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Kamera" subtitle="Dokumentasikan progres kebiasaanmu" />
      <View style={styles.switcher}>
        <SegmentedControl<CameraMode>
          options={[
            { value: 'capture', label: 'Ambil foto' },
            { value: 'gallery', label: 'Galeri' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </View>
      <View style={styles.body}>
        {mode === 'capture' ? <CaptureSection /> : <PhotoGallery />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  switcher: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  body: {
    flex: 1,
  },
});
