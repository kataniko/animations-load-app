import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TodoList } from '@/components/home';
import {
  ThemeTransition,
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { GlassCard } from '@/shared/glass/GlassCard';
import { Action, Copy } from '@/shared/showcase/Showcase';
import { AnimatedGradientText } from '@/shared/typography/AnimatedGradientText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ShowcaseScreen() {
  const { theme, isDark, toggleTheme, transition, applyTransitionTheme, finishTransition } = useAppTheme();
  const backgroundStyle = useAnimatedThemeBackground('#09090b', '#f4f4f5');
  const surfaceStyle = useAnimatedThemeBackground('#18181b', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(0,0,0,0.08)');
  const textStyle = useAnimatedThemeColor('#e4e4e7', '#09090b');
  const mutedStyle = useAnimatedThemeColor('#a1a1aa', '#71717a');
  const accentStyle = useAnimatedThemeColor('#fafafa', '#09090b');

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      <AnimatedGradientBackground />
      {transition && (
        <ThemeTransition color={transition.color} x={transition.x} y={transition.y} nextIsDark={transition.nextIsDark} onApply={applyTransitionTheme} onFinish={finishTransition} />
      )}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logo}><MaterialIcons name="auto-awesome-motion" size={24} color="#09090b" /></View>
              <AnimatedPressable accessibilityLabel="Toggle theme" accessibilityRole="button" onPress={(event) => toggleTheme({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })} style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }, surfaceStyle, borderStyle]}>
                <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={20} color={theme.accent} />
              </AnimatedPressable>
            </View>
            <Animated.Text style={[styles.kicker, { color: theme.accent }, accentStyle]}>React Native</Animated.Text>
            <AnimatedGradientText style={[styles.title, { color: theme.text }]}>Animation Showcase</AnimatedGradientText>
            <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
              Interactive mobile motion patterns built with React Native and Reanimated.
            </Animated.Text>
          </View>

          <Animated.View entering={FadeInDown.springify()}>
            <GlassCard style={styles.hero}>
              <Animated.Text style={[styles.heroLabel, { color: theme.accent }, accentStyle]}>SHOWCASE</Animated.Text>
              <Animated.Text style={[styles.heroTitle, { color: theme.text }, textStyle]}>Fluid motion patterns & gestures</Animated.Text>
              <View style={styles.heroOrb} /><View style={styles.heroRing} />
            </GlassCard>
          </Animated.View>

          <View style={{ gap: 12, marginTop: 24 }}>
            <Action label="▶ Presentation walkthrough" selected onPress={() => router.push('/presentation')} />
            <Action label="Browse libraries & components" onPress={() => router.push('/(tabs)/explore')} />
            <Action label="Coding exercises" onPress={() => router.push('/exercises' as never)} />
          </View>

          <View style={styles.sectionHeader}>
            <Animated.Text style={[styles.sectionTitle, { color: theme.text }, textStyle]}>Tasks</Animated.Text>
            <Animated.Text style={[styles.sectionMeta, { color: theme.textMuted }, mutedStyle]}>3 items</Animated.Text>
          </View>
          <TodoList />
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#09090b', flex: 1 }, safeArea: { flex: 1 }, content: { padding: 20, paddingBottom: 130 }, header: { marginTop: 12 },
  headerTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, themeButton: { alignItems: 'center', borderRadius: 18, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  logo: { alignItems: 'center', backgroundColor: '#d4d4d4', borderRadius: 18, height: 44, justifyContent: 'center', marginBottom: 18, width: 44 }, kicker: { color: '#fafafa', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { color: '#fafafa', fontSize: 36, fontWeight: '900', lineHeight: 40, marginTop: 6 }, subtitle: { color: '#a3a3a3', fontSize: 15, lineHeight: 22, marginTop: 14 }, hero: { borderRadius: 26, height: 190, justifyContent: 'flex-end', marginTop: 26, overflow: 'hidden', padding: 18 },
  heroLabel: { color: '#d4d4d4', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 }, heroTitle: { color: '#fafafa', fontSize: 21, fontWeight: '900', lineHeight: 26, marginTop: 6, maxWidth: '78%' }, heroOrb: { backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: 70, height: 140, position: 'absolute', right: -25, top: -25, width: 140 }, heroRing: { borderColor: '#fafafa', borderRadius: 70, borderWidth: 2, height: 120, position: 'absolute', right: 28, top: 36, width: 120 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 12 }, sectionTitle: { color: '#fafafa', fontSize: 20, fontWeight: '900' }, sectionMeta: { color: '#a3a3a3', fontSize: 13, fontWeight: '700' },
});
