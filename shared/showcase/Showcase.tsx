import {
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ShowcaseScreen({ title, eyebrow, children }: PropsWithChildren<{ title: string; eyebrow: string }>) {
  const { theme } = useAppTheme();
  return (
    <View style={[showcaseStyles.screen, { backgroundColor: theme.background }]}>
      <AnimatedGradientBackground />
      <SafeAreaView style={showcaseStyles.screen}>
        <ScrollView contentContainerStyle={showcaseStyles.content} keyboardShouldPersistTaps="handled">
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/explore')} style={showcaseStyles.back}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[showcaseStyles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
          <Text accessibilityRole="header" style={[showcaseStyles.title, { color: theme.text }]}>{title}</Text>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function Copy({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  return <Text style={[showcaseStyles.copy, { color: theme.textMuted }]}>{children}</Text>;
}

export function Panel({ title, children }: PropsWithChildren<{ title: string }>) {
  const { theme } = useAppTheme();
  return (
    <View style={[showcaseStyles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text accessibilityRole="header" style={[showcaseStyles.heading, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

export function Action({ label, onPress, selected, disabled = false }: {
  label: string; onPress: () => void; selected?: boolean; disabled?: boolean;
}) {
  const actionBackgroundStyle = useAnimatedThemeBackground('#283952', '#e0eafa');
  const actionBorderStyle = useAnimatedThemeBorder('#56708d', '#adc0dc');
  const actionTextStyle = useAnimatedThemeColor('#f1f5ff', '#1d304e');
  const selectedBackgroundStyle = useAnimatedThemeBackground('#2563eb', '#245aca');
  const selectedBorderStyle = useAnimatedThemeBorder('#2563eb', '#245aca');
  const selectedTextStyle = useAnimatedThemeColor('#ffffff', '#ffffff');
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        showcaseStyles.action,
        selected ? selectedBackgroundStyle : actionBackgroundStyle,
        selected ? selectedBorderStyle : actionBorderStyle,
        { opacity: disabled ? 0.4 : 1 },
      ]}
    >
      <Animated.Text
        style={[
          showcaseStyles.actionText,
          selected ? selectedTextStyle : actionTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

export const showcaseStyles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' },
  back: { width: 48, height: 48, justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '900' },
  heading: { fontSize: 18, fontWeight: '800' },
  copy: { fontSize: 15, lineHeight: 23 },
  panel: { padding: 16, borderWidth: 1, borderRadius: 24, gap: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  action: { minHeight: 48, minWidth: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '700' },
  stage: { height: 200, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' },
  lane: { height: 56, borderRadius: 16, justifyContent: 'center', overflow: 'hidden' },
  ball: { width: 40, height: 40, borderRadius: 20 },
  code: { fontFamily: 'SpaceMono', fontSize: 12, lineHeight: 20 },
});
