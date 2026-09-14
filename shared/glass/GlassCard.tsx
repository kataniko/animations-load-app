import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useAppTheme } from '@/context/ThemeContext';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GlassCard({ children, style }: GlassCardProps) {
  const { themeProgress } = useAppTheme();
  const darkStyle = useAnimatedStyle(() => ({ opacity: 1 - themeProgress.value }));
  const lightStyle = useAnimatedStyle(() => ({ opacity: themeProgress.value }));

  return (
    <Animated.View style={[styles.card, style]}>
      {Platform.OS === 'ios' && isLiquidGlassAvailable() ? (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, darkStyle]}>
            <GlassView colorScheme="dark" glassEffectStyle="regular" style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
            <GlassView colorScheme="light" glassEffectStyle="regular" style={StyleSheet.absoluteFill} />
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, darkStyle]}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
            <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill} />
          </Animated.View>
        </>
      )}
      <Animated.View style={[StyleSheet.absoluteFill, darkStyle]}>
        <LinearGradient colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
        <LinearGradient colors={['rgba(255,255,255,0.76)', 'rgba(219,234,254,0.42)', 'rgba(255,255,255,0.62)']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    zIndex: 1,
  },
});
