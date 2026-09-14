import { appColors } from '@/constants/AppColors';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function MaterialDemo() {
  const { theme, isDark } = useAppTheme();
  const target = useRef<View>(null);
  const [intensity, setIntensity] = useState(40);
  const [moved, setMoved] = useState(false);
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <>
      <View style={[s.stage, { backgroundColor: theme.surfaceElevated }]}>
        <BlurTargetView ref={target} style={StyleSheet.absoluteFill}>
          <LinearGradient colors={[appColors.accentBlue, appColors.background]} style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.light, style]} />
          <Text style={styles.backgroundText}>{'MOTION\nMATERIAL'}</Text>
        </BlurTargetView>
        <View style={styles.glass}>
          <BlurView
            blurTarget={target}
            blurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            tint={isDark ? 'dark' : 'light'}
            intensity={intensity}
            style={StyleSheet.absoluteFill}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: theme.background,
                opacity: 0.2 + intensity / 125,
              },
            ]}
          />
          <Text style={[s.heading, { color: theme.text }]}>Context, not noise.</Text>
          <Text style={[s.copy, { color: theme.text }]}>Blur · {intensity}%</Text>
        </View>
      </View>
      <View style={s.row}>
        {[0, 40, 80].map(value => <Action key={value} label={`${value}% blur`} selected={intensity === value} onPress={() => setIntensity(value)} />)}
      </View>
      <Action label="Animate background" onPress={() => { setMoved(!moved); offset.set(withSpring(moved ? 0 : 140)); }} />
      <Copy>{Platform.OS === 'android' && Number(Platform.Version) < 31
        ? 'Android below SDK 31: translucent fallback without full blur pipeline.'
        : 'The background target is captured directly behind the surface with real-time blur.'}</Copy>
    </>
  );
}
const styles = StyleSheet.create({
  light: { width: 100, height: 220, backgroundColor: appColors.primary, opacity: 0.8, position: 'absolute', top: -10, left: 8, borderRadius: 50 },
  backgroundText: { color: appColors.accentText, fontSize: 36, fontWeight: '900', position: 'absolute', right: 8, top: 16 },
  glass: { marginHorizontal: 16, padding: 20, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: appColors.glassStrong, gap: 8 },
});
