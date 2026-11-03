import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  fillColor?: string;
  trackColor?: string;
}

export function ProgressBar({
  progress,
  fillColor = colors.primary,
  trackColor = colors.primaryLight,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 100);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 600 });
  }, [clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={[styles.track, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.fill, { backgroundColor: fillColor }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
