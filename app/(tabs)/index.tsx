import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemeTransition,
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const demos = [
  {
    title: 'Feed reveal',
    description: 'Entrada stagger com spring',
    library: 'Reanimated',
    icon: 'vertical-align-bottom' as const,
    color: '#f09ad6',
  },
  {
    title: 'Like burst',
    description: 'Feedback de toque com partículas',
    library: 'Reanimated',
    icon: 'favorite' as const,
    color: '#f6d088',
  },
  {
    title: 'Motion Orb 3D',
    description: 'Cena em tempo real com R3F',
    library: 'React Three Fiber',
    icon: 'view-in-ar' as const,
    color: '#8da2ff',
  },
];

export default function ShowcaseScreen() {
  const { theme, isDark, toggleTheme, transition, applyTransitionTheme, finishTransition } = useAppTheme();
  const backgroundStyle = useAnimatedThemeBackground('#17191c', '#f5f5f5');
  const surfaceStyle = useAnimatedThemeBackground('#23262a', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(23,25,28,0.12)');
  const textStyle = useAnimatedThemeColor('#f5f5f5', '#17191c');
  const mutedStyle = useAnimatedThemeColor('#9da3a8', '#697078');
  const accentStyle = useAnimatedThemeColor('#ffb24f', '#e99a25');
  const accentBackgroundStyle = useAnimatedThemeBackground('#ffb24f', '#e99a25');
  const accentTextStyle = useAnimatedThemeColor('#17191c', '#ffffff');

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      {transition && (
        <ThemeTransition
          color={transition.color}
          x={transition.x}
          y={transition.y}
          nextIsDark={transition.nextIsDark}
          onApply={applyTransitionTheme}
          onFinish={finishTransition}
        />
      )}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logo}>
              <MaterialIcons name="auto-awesome-motion" size={24} color="#171219" />
              </View>
              <AnimatedPressable
                accessibilityLabel="Alternar tema"
                accessibilityRole="button"
                onPress={(event) => toggleTheme({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })}
                style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }, surfaceStyle, borderStyle]}>
                <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={20} color={theme.accent} />
              </AnimatedPressable>
            </View>
            <Animated.Text style={[styles.kicker, { color: theme.accent }, accentStyle]}>React Native</Animated.Text>
            <Animated.Text style={[styles.title, { color: theme.text }, textStyle]}>Animation Showcase</Animated.Text>
            <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
              Uma coleção de animações mobile interativas, construída com Animated, Reanimated e React Three Fiber.
            </Animated.Text>
          </View>

          <Animated.View entering={FadeInDown.springify()} style={[styles.hero, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, surfaceStyle, borderStyle]}>
            <Animated.Text style={[styles.heroLabel, { color: theme.accent }, accentStyle]}>SHOWCASE</Animated.Text>
            <Animated.Text style={[styles.heroTitle, { color: theme.text }, textStyle]}>Motion torna a interface mais clara, rápida e viva.</Animated.Text>
            <View style={styles.heroOrb} />
            <View style={styles.heroRing} />
          </Animated.View>

          <View style={styles.sectionHeader}>
            <Animated.Text style={[styles.sectionTitle, { color: theme.text }, textStyle]}>Demonstrações</Animated.Text>
            <Animated.Text style={[styles.sectionMeta, { color: theme.textMuted }, mutedStyle]}>3 experiências</Animated.Text>
          </View>

          {demos.map((demo, index) => (
            <DemoCard key={demo.title} demo={demo} index={index} />
          ))}

          <AnimatedPressable onPress={() => router.push('/(tabs)/three')} style={[styles.primaryButton, { backgroundColor: theme.accent }, accentBackgroundStyle]}>
            <MaterialIcons name="play-arrow" size={22} color={theme.accentText} />
            <Animated.Text style={[styles.primaryButtonText, { color: theme.accentText }, accentTextStyle]}>Abrir showcase 3D</Animated.Text>
          </AnimatedPressable>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function DemoCard({
  demo,
  index,
}: {
  demo: (typeof demos)[number];
  index: number;
}) {
  const { theme } = useAppTheme();
  const surfaceStyle = useAnimatedThemeBackground('#23262a', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(23,25,28,0.12)');
  const textStyle = useAnimatedThemeColor('#f5f5f5', '#17191c');
  const mutedStyle = useAnimatedThemeColor('#9da3a8', '#697078');
  const accentStyle = useAnimatedThemeColor('#ffb24f', '#e99a25');
  const [active, setActive] = useState(false);
  const scale = useSharedValue(1);
  const burst = useSharedValue(0);
  const mounted = useRef(false);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value === 0 ? 0 : 1 - burst.value,
    transform: [{ scale: 0.6 + burst.value * 1.3 }],
  }));

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    // Reanimated shared values are intentionally mutable.
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(withSpring(1.25), withSpring(1));
    burst.value = 0;
    burst.value = withTiming(1, { duration: 420 });
  }, [active, burst, scale]);

  function playDemo() {
    if (demo.title === 'Motion Orb 3D') {
      router.push('/(tabs)/three');
      return;
    }
    setActive((current) => !current);
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <AnimatedPressable onPress={playDemo} style={[styles.demoCard, { backgroundColor: theme.surface, borderColor: theme.border }, surfaceStyle, borderStyle]}>
        <View style={[styles.demoIcon, { backgroundColor: demo.color }]}>
          <Animated.View style={iconStyle}>
            <MaterialIcons name={demo.icon} size={24} color="#171219" />
          </Animated.View>
          {demo.title === 'Like burst' && (
            <Animated.View pointerEvents="none" style={[styles.burst, burstStyle]}>
              <View style={[styles.dot, styles.dotPink]} />
              <View style={[styles.dot, styles.dotBlue]} />
              <View style={[styles.dot, styles.dotWhite]} />
            </Animated.View>
          )}
        </View>
        <View style={styles.demoCopy}>
          <Animated.Text style={[styles.demoTitle, { color: theme.text }, textStyle]}>{demo.title}</Animated.Text>
          <Animated.Text style={[styles.demoDescription, { color: theme.textMuted }, mutedStyle]}>{demo.description}</Animated.Text>
          <Animated.Text style={[styles.demoLibrary, { color: theme.accent }, accentStyle]}>{demo.library}</Animated.Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#0d0a12',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 130,
  },
  header: {
    marginTop: 12,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: '#f09ad6',
    borderRadius: 18,
    height: 44,
    justifyContent: 'center',
    marginBottom: 18,
    width: 44,
  },
  kicker: {
    color: '#f6d088',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff7fb',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
    marginTop: 6,
  },
  subtitle: {
    color: '#c8b7c9',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
  hero: {
    backgroundColor: '#211725',
    borderColor: 'rgba(240, 154, 214, 0.35)',
    borderRadius: 26,
    borderWidth: 1,
    height: 190,
    justifyContent: 'flex-end',
    marginTop: 26,
    overflow: 'hidden',
    padding: 18,
  },
  heroLabel: {
    color: '#f09ad6',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#fff7fb',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 6,
    maxWidth: '78%',
  },
  heroOrb: {
    backgroundColor: 'rgba(240, 154, 214, 0.75)',
    borderRadius: 70,
    height: 140,
    position: 'absolute',
    right: -25,
    top: -25,
    width: 140,
  },
  heroRing: {
    borderColor: '#f6d088',
    borderRadius: 70,
    borderWidth: 2,
    height: 120,
    position: 'absolute',
    right: 28,
    top: 36,
    width: 120,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff7fb',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionMeta: {
    color: '#c8b7c9',
    fontSize: 13,
    fontWeight: '700',
  },
  demoCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    padding: 14,
  },
  demoIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  demoCopy: {
    flex: 1,
  },
  demoTitle: {
    color: '#fff7fb',
    fontSize: 16,
    fontWeight: '900',
  },
  demoDescription: {
    color: '#c8b7c9',
    fontSize: 13,
    marginTop: 4,
  },
  demoLibrary: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 5,
  },
  burst: {
    ...StyleSheet.absoluteFill,
  },
  dot: {
    borderRadius: 4,
    height: 7,
    position: 'absolute',
    width: 7,
  },
  dotPink: { backgroundColor: '#f09ad6', left: 0, top: 0 },
  dotBlue: { backgroundColor: '#8da2ff', bottom: 1, right: 0 },
  dotWhite: { backgroundColor: '#fff7fb', right: 2, top: 3 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#f6d088',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: '#171219',
    fontSize: 15,
    fontWeight: '900',
  },
});
