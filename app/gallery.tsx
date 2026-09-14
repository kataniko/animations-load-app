import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BeamInput } from '@/components/gallery/BeamInput';
import { ElasticDrawerDemo } from '@/components/gallery/ElasticDrawerDemo';
import { GalleryPanel } from '@/components/gallery/GalleryPanel';
import { GlassCommandCard } from '@/components/gallery/GlassCommandCard';
import { GlowInput } from '@/components/gallery/GlowInput';
import { LiquidBlob } from '@/components/gallery/LiquidBlob';
import { MagneticButton } from '@/components/gallery/MagneticButton';
import { OrbPlayground } from '@/components/gallery/OrbPlayground';
import { SegmentedPillDemo } from '@/components/gallery/SegmentedPillDemo';
import { SuccessCheck } from '@/components/gallery/SuccessCheck';
import { SwipeCard } from '@/components/gallery/SwipeCard';
import { TiltCardDemo } from '@/components/gallery/TiltCardDemo';
import {
  palette,
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { Action } from '@/shared/showcase/Showcase';
import { AnimatedGradientText } from '@/shared/typography/AnimatedGradientText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GalleryScreen() {
  const { theme } = useAppTheme();
  const focused = useIsFocused();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const activeSection = section ?? 'all';

  const backgroundStyle = useAnimatedThemeBackground(palette.dark.background, palette.light.background);
  const surfaceStyle = useAnimatedThemeBackground(palette.dark.surface, palette.light.surface);
  const borderStyle = useAnimatedThemeBorder(palette.dark.border, palette.light.border);
  const mutedStyle = useAnimatedThemeColor(palette.dark.textMuted, palette.light.textMuted);
  const accentStyle = useAnimatedThemeColor(palette.dark.text, palette.light.accent);

  const buttonColor = theme.accent;
  const buttonTextColor = theme.accentText;

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AnimatedPressable
              accessibilityLabel="Back"
              accessibilityRole="button"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/explore'))}
              style={[
                styles.backButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                surfaceStyle,
                borderStyle,
              ]}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </AnimatedPressable>
            <Animated.Text style={[styles.kicker, { color: theme.accent }, accentStyle]}>
              Motion & Canvas
            </Animated.Text>
            <AnimatedGradientText style={[styles.title, { color: theme.text }]}>
              Animation Gallery
            </AnimatedGradientText>
            <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
              Motion patterns with Reanimated, Skia canvas, and materials.
            </Animated.Text>
          </View>

          {activeSection !== 'all' ? (
            <Action
              label="← Show all components"
              onPress={() => router.setParams({ section: 'all' })}
            />
          ) : null}

          <GalleryPanel
            visible={focused && ['all', 'gestures'].includes(activeSection)}
            title="Tilt depth card"
            library="Gesture Handler · 3D tilt"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <TiltCardDemo theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'gestures'].includes(activeSection)}
            title="Pan swipe card"
            library="Gesture Handler · elastic snap"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <SwipeCard theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'reanimated'].includes(activeSection)}
            title="Spring drawer"
            library="Reanimated · physics bounce"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <ElasticDrawerDemo theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'reanimated'].includes(activeSection)}
            title="Segmented pill"
            library="Reanimated · magnetic cursor"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <SegmentedPillDemo theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'skia'].includes(activeSection)}
            title="Liquid blob fusion"
            library="Skia · 2D canvas"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <LiquidBlob color={theme.accent} secondaryColor={theme.accent} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'materials'].includes(activeSection)}
            title="Glass command card"
            library="BlurView · material layer"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <GlassCommandCard theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'reanimated'].includes(activeSection)}
            title="Thinking Orb states"
            library="Skia + Reanimated · procedural shader"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <OrbPlayground theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'reanimated'].includes(activeSection)}
            title="Success toggle"
            library="Reanimated · keyframe rotation"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <SuccessCheck color={buttonColor} textColor={buttonTextColor} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'reanimated'].includes(activeSection)}
            title="Magnetic touch"
            library="Reanimated · scale bounce"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <MagneticButton color={buttonColor} textColor={buttonTextColor} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'materials'].includes(activeSection)}
            title="Border beam card"
            library="Skia / SVG · perimeter glow"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <BeamInput theme={theme} />
          </GalleryPanel>

          <GalleryPanel
            visible={focused && ['all', 'materials'].includes(activeSection)}
            title="Glow command input"
            library="Reanimated · focus ring"
            theme={theme}
            surfaceStyle={surfaceStyle}
            borderStyle={borderStyle}
          >
            <GlowInput theme={theme} />
          </GalleryPanel>
        </Animated.ScrollView>
      </SafeAreaView>
    </Animated.View>
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
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    width: 48,
  },
  kicker: { fontSize: 12, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 36, fontWeight: '900', marginTop: 6 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  content: { gap: 14, padding: 20, paddingTop: 0, paddingBottom: 130 },
});
