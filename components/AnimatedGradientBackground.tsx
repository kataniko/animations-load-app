import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { appColors } from '@/constants/AppColors';
import { useAppTheme } from '@/context/ThemeContext';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function AnimatedGradientBackground() {
  const { themeProgress } = useAppTheme();
  const drift = useSharedValue(0);
  const glow = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 90 },
      { translateY: drift.value * 36 },
      { scale: 1.15 },
    ],
  }));
  const darkGlow = useAnimatedStyle(() => ({ opacity: 0.7 * (1 - themeProgress.value) }));
  const lightGlow = useAnimatedStyle(() => ({ opacity: 0.45 * themeProgress.value }));

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 9000 }), -1, true);
  }, [drift]);

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <AnimatedLinearGradient
        colors={['transparent', appColors.accentBlueSoft, 'transparent']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFill, styles.gradient, glow, darkGlow]}
      />
      <AnimatedLinearGradient
        colors={['transparent', 'rgba(59, 130, 246, 0.08)', 'transparent']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFill, styles.gradient, glow, lightGlow]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: '130%',
    left: '-15%',
    top: '-15%',
    width: '130%',
  },
});
