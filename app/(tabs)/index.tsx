import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { AnimatedGradientText } from '@/components/AnimatedGradientText';
import { GlassCard } from '@/components/GlassCard';
import { useState } from 'react';
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
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcons);

export default function ShowcaseScreen() {
  const { theme, isDark, toggleTheme, transition, applyTransitionTheme, finishTransition } = useAppTheme();
  const backgroundStyle = useAnimatedThemeBackground('#09090b', '#fafafa');
  const surfaceStyle = useAnimatedThemeBackground('#18181b', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(23,25,28,0.12)');
  const textStyle = useAnimatedThemeColor('#e4e4e7', '#18181b');
  const mutedStyle = useAnimatedThemeColor('#a1a1aa', '#71717a');
  const accentStyle = useAnimatedThemeColor('#fafafa', '#18181b');

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      <AnimatedGradientBackground />
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
              <MaterialIcons name="auto-awesome-motion" size={24} color="#09090b" />
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
            <AnimatedGradientText
              style={[styles.title, { color: theme.text }]}
            >
              Animation Showcase
            </AnimatedGradientText>
            <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
              Uma coleção de animações mobile interativas, construída com Animated, Reanimated e React Three Fiber.
            </Animated.Text>
          </View>

          <Animated.View entering={FadeInDown.springify()}>
            <GlassCard style={styles.hero}>
              <Animated.Text style={[styles.heroLabel, { color: theme.accent }, accentStyle]}>SHOWCASE</Animated.Text>
              <Animated.Text style={[styles.heroTitle, { color: theme.text }, textStyle]}>Motion torna a interface mais clara, rápida e viva.</Animated.Text>
              <View style={styles.heroOrb} />
              <View style={styles.heroRing} />
            </GlassCard>
          </Animated.View>

          <View style={styles.sectionHeader}>
            <Animated.Text style={[styles.sectionTitle, { color: theme.text }, textStyle]}>Lista do dia</Animated.Text>
            <Animated.Text style={[styles.sectionMeta, { color: theme.textMuted }, mutedStyle]}>3 tarefas</Animated.Text>
          </View>

          <TodoList />

        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function TodoList() {
  const [tasks, setTasks] = useState([
    { label: 'Planear a próxima animação', done: true },
    { label: 'Testar a interação no dispositivo', done: false },
    { label: 'Publicar o showcase', done: false },
  ]);

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <GlassCard style={styles.todoCard}>
        {tasks.map((task, index) => (
        <TodoRow
          key={task.label}
          task={task}
          index={index}
          onPress={() => setTasks((current) => current.map((item) => item.label === task.label ? { ...item, done: !item.done } : item))}
        />
        ))}
      </GlassCard>
    </Animated.View>
  );
}

function TodoRow({
  task,
  index,
  onPress,
}: {
  task: { label: string; done: boolean };
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const textStyle = useAnimatedThemeColor('#e4e4e7', '#18181b');
  const checkboxBorderStyle = useAnimatedThemeBorder('#27272a', '#d4d4d8');
  const checkboxBackgroundStyle = useAnimatedThemeBackground('#fafafa', '#18181b');
  const checkColorStyle = useAnimatedThemeColor('#18181b', '#fafafa');
  const rowBorderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.08)', 'rgba(24,24,27,0.08)');

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <AnimatedPressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        onPress={() => {
          // Reanimated shared values are intentionally mutable.
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSequence(withSpring(0.94), withSpring(1));
          onPress();
        }}
        style={[styles.todoRow, rowBorderStyle, style]}>
        <Animated.View style={[styles.checkbox, checkboxBorderStyle, task.done && [checkboxBackgroundStyle, checkboxBorderStyle]]}>
          {task.done && <AnimatedMaterialIcon name="check" size={16} style={checkColorStyle} />}
        </Animated.View>
        <Animated.Text style={[styles.todoText, textStyle, task.done && styles.todoTextDone]}>{task.label}</Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#09090b',
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
    backgroundColor: '#d4d4d4',
    borderRadius: 18,
    height: 44,
    justifyContent: 'center',
    marginBottom: 18,
    width: 44,
  },
  kicker: {
    color: '#fafafa',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fafafa',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
    marginTop: 6,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
  hero: {
    borderRadius: 26,
    height: 190,
    justifyContent: 'flex-end',
    marginTop: 26,
    overflow: 'hidden',
    padding: 18,
  },
  heroLabel: {
    color: '#d4d4d4',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#fafafa',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 6,
    maxWidth: '78%',
  },
  heroOrb: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 70,
    height: 140,
    position: 'absolute',
    right: -25,
    top: -25,
    width: 140,
  },
  heroRing: {
    borderColor: '#fafafa',
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
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionMeta: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '700',
  },
  todoCard: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  todoRow: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  todoTextDone: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
});
