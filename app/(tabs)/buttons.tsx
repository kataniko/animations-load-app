import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AnimatedGradientText } from '@/components/AnimatedGradientText';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function ButtonsScreen() {
  const { theme } = useAppTheme();
  const backgroundStyle = useAnimatedThemeBackground('#09090b', '#fafafa');
  const mutedStyle = useAnimatedThemeColor('#a1a1aa', '#71717a');
  const surfaceStyle = useAnimatedThemeBackground('#18181b', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(23,25,28,0.12)');

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MaterialIcons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.kicker, { color: theme.accent }]}>Reanimated</Text>
          <AnimatedGradientText style={[styles.title, { color: theme.text }]}>Button Motion</AnimatedGradientText>
          <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
            Pequenas interações que tornam cada toque mais claro.
          </Animated.Text>
        </View>

        <Animated.ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DemoPanel theme={theme} title="Spring press" library="Reanimated" surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <SpringButton color={theme.accent} textColor={theme.accentText} />
          </DemoPanel>

          <DemoPanel theme={theme} title="State transition" library="Reanimated" surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <LoadingButton color={theme.accent} textColor={theme.accentText} />
          </DemoPanel>

          <DemoPanel theme={theme} title="Icon feedback" library="Reanimated" surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <IconButton color={theme.accent} textColor={theme.accentText} />
          </DemoPanel>

          <DemoPanel theme={theme} title="Animate number" library="Reanimated · alternativa gratuita" surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <AnimatedNumberDemo theme={theme} />
          </DemoPanel>
        </Animated.ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function DemoPanel({
  theme,
  title,
  library,
  surfaceStyle,
  borderStyle,
  children,
}: {
  theme: ReturnType<typeof useAppTheme>['theme'];
  title: string;
  library: string;
  surfaceStyle: object;
  borderStyle: object;
  children: ReactNode;
}) {
  return (
    <GlassCard style={[styles.panel, surfaceStyle, borderStyle]}>
      <View style={styles.panelHeader}>
        <Animated.Text style={[styles.panelTitle, { color: theme.text }]}>{title}</Animated.Text>
        <Animated.Text style={[styles.library, { color: theme.accent }]}>{library}</Animated.Text>
      </View>
      {children}
    </GlassCard>
  );
}

function SpringButton({ color, textColor }: { color: string; textColor: string }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={() => {
        // Reanimated shared values are intentionally mutable.
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSequence(withSpring(1.08), withSpring(1));
      }}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.94);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1);
      }}
      style={[styles.demoButton, { backgroundColor: color }, animatedStyle]}>
      <Text style={[styles.demoButtonText, { color: textColor }]}>Press me</Text>
    </AnimatedPressable>
  );
}

function LoadingButton({ color, textColor }: { color: string; textColor: string }) {
  const [loading, setLoading] = useState(false);
  const rotation = useSharedValue(0);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function press() {
    if (loading) return;
    setLoading(true);
    rotation.value = 0;
    // Animate rotation continuously while loading
    rotation.value = withRepeat(withTiming(360, { duration: 800 }), -1, false);
    setTimeout(() => {
      cancelAnimation(rotation);
      rotation.value = 0;
      setLoading(false);
    }, 1500);
  }

  return (
    <Pressable onPress={press} style={[styles.demoButton, { backgroundColor: color }]}>
      {loading ? (
        <View style={styles.loadingRow}>
          <Animated.View style={spinnerStyle}>
            <MaterialIcons name="refresh" size={18} color={textColor} />
          </Animated.View>
          <Text style={[styles.demoButtonText, { color: textColor }]}>Saving…</Text>
        </View>
      ) : (
        <Text style={[styles.demoButtonText, { color: textColor }]}>Save changes</Text>
      )}
    </Pressable>
  );
}

function IconButton({ color, textColor }: { color: string; textColor: string }) {
  const [active, setActive] = useState(false);
  const scale = useSharedValue(1);
  const burst = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const burstCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.4, 1.8]) }],
    opacity: interpolate(burst.value, [0, 0.5, 1], [0.8, 0.6, 0]),
  }));

  function press() {
    const next = !active;
    setActive(next);
    scale.value = withSequence(
      withSpring(1.35, { damping: 4, stiffness: 300 }),
      withSpring(1)
    );
    if (next) {
      burst.value = 0;
      burst.value = withTiming(1, { duration: 400 });
    }
  }

  return (
    <View style={styles.iconButtonContainer}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burstRing,
          { borderColor: '#ef4444' },
          burstCircleStyle,
        ]}
      />
      <AnimatedPressable
        onPress={press}
        style={[
          styles.iconButton,
          { backgroundColor: active ? '#ef4444' : color },
          iconStyle,
        ]}>
        <MaterialIcons
          name={active ? 'favorite' : 'favorite-border'}
          size={24}
          color={active ? '#ffffff' : textColor}
        />
      </AnimatedPressable>
    </View>
  );
}

function AnimatedNumberDemo({ theme }: { theme: { text: string; textMuted: string; accent: string; accentText: string } }) {
  const [number, setNumber] = useState(128);
  const value = useSharedValue(128);
  const animatedProps = useAnimatedProps(() => ({
    text: `${Math.round(value.value)}`,
  } as any));

  function changeBy(amount: number) {
    const next = Math.max(0, number + amount);
    setNumber(next);
    // Reanimated shared values are intentionally mutable.
    // eslint-disable-next-line react-hooks/immutability
    value.value = withTiming(next, { duration: 450 });
  }

  return (
    <View style={styles.numberDemo}>
      <AnimatedTextInput
        accessibilityLabel="Animated number"
        animatedProps={animatedProps}
        defaultValue="128"
        editable={false}
        style={[styles.number, { color: theme.text }]}
      />
      <View style={styles.numberControls}>
        <Pressable onPress={() => changeBy(-1)} style={[styles.numberButton, { borderColor: theme.accent }]}>
          <MaterialIcons name="remove" size={20} color={theme.accent} />
        </Pressable>
        <Text style={[styles.numberHint, { color: theme.textMuted }]}>withTiming</Text>
        <Pressable onPress={() => changeBy(1)} style={[styles.numberButton, { backgroundColor: theme.accent }]}>
          <MaterialIcons name="add" size={20} color={theme.accentText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: 20, paddingTop: 12 },
  backButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginBottom: 22,
    width: 40,
  },
  kicker: { fontSize: 12, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 34, fontWeight: '900', marginTop: 6 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  content: { gap: 14, padding: 20, paddingTop: 0, paddingBottom: 130 },
  panel: { borderRadius: 22, padding: 16 },
  panelHeader: { alignItems: 'flex-start', gap: 5, marginBottom: 16 },
  panelTitle: { fontSize: 18, fontWeight: '900' },
  library: { fontSize: 11, fontWeight: '800' },
  demoButton: { alignItems: 'center', borderRadius: 18, justifyContent: 'center', minHeight: 52, paddingHorizontal: 20 },
  demoButtonText: { fontSize: 15, fontWeight: '900' },
  loadingRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  iconButtonContainer: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  burstRing: { borderRadius: 32, borderWidth: 2, height: 52, position: 'absolute', width: 52 },
  iconButton: { alignItems: 'center', borderRadius: 18, height: 52, justifyContent: 'center', width: 52 },
  numberDemo: { alignItems: 'center' },
  number: { fontSize: 54, fontWeight: '900', padding: 0, textAlign: 'center', width: 180 },
  numberControls: { alignItems: 'center', flexDirection: 'row', gap: 14, marginTop: 10 },
  numberButton: { alignItems: 'center', borderRadius: 17, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  numberHint: { fontSize: 12, fontWeight: '800' },
});
