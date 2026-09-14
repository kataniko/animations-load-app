import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useIsFocused } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedNumberDemo } from '@/components/buttons/AnimatedNumberDemo';
import { DemoPanel } from '@/components/buttons/DemoPanel';
import { IconButton } from '@/components/buttons/IconButton';
import { LoadingButton } from '@/components/buttons/LoadingButton';
import { SpringButton } from '@/components/buttons/SpringButton';
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

export default function ButtonsScreen() {
  const { theme } = useAppTheme();
  const focused = useIsFocused();
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
              Interactive States
            </Animated.Text>
            <AnimatedGradientText style={[styles.title, { color: theme.text }]}>
              Button Motion
            </AnimatedGradientText>
            <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
              Tactile and visual press feedback for interactive surfaces.
            </Animated.Text>
          </View>

          <Action
            label="View presentation: Spring dynamics"
            onPress={() => router.push('/presentation')}
          />

          {focused ? (
            <>
              <DemoPanel
                theme={theme}
                title="Spring press"
                library="Reanimated · spring physics"
                surfaceStyle={surfaceStyle}
                borderStyle={borderStyle}
              >
                <SpringButton color={buttonColor} textColor={buttonTextColor} />
              </DemoPanel>

              <DemoPanel
                theme={theme}
                title="Async loading"
                library="Reanimated · continuous rotation"
                surfaceStyle={surfaceStyle}
                borderStyle={borderStyle}
              >
                <LoadingButton color={buttonColor} textColor={buttonTextColor} />
              </DemoPanel>

              <DemoPanel
                theme={theme}
                title="Heart burst"
                library="Reanimated · scale burst"
                surfaceStyle={surfaceStyle}
                borderStyle={borderStyle}
              >
                <IconButton color={buttonColor} textColor={buttonTextColor} />
              </DemoPanel>

              <DemoPanel
                theme={theme}
                title="Animate number"
                library="Reanimated · layout ticker"
                surfaceStyle={surfaceStyle}
                borderStyle={borderStyle}
              >
                <AnimatedNumberDemo theme={theme} />
              </DemoPanel>
            </>
          ) : null}
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
  title: { fontSize: 34, fontWeight: '900', marginTop: 6 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  content: { gap: 14, padding: 20, paddingTop: 0, paddingBottom: 130 },
});
