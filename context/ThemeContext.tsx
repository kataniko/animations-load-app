import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { appColors } from '@/constants/AppColors';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const palette = {
  dark: {
    mode: 'dark' as const,
    background: appColors.background,
    surface: appColors.surface,
    surfaceElevated: appColors.surfaceElevated,
    text: appColors.primary,
    textMuted: appColors.secondary,
    border: appColors.border,
    accent: appColors.accentBlue,
    accentText: '#ffffff',
  },
  light: {
    mode: 'light' as const,
    background: '#ffffff',
    surface: '#ffffff',
    surfaceElevated: '#fafafa',
    text: '#18181b',
    textMuted: '#71717a',
    border: '#e4e4e7',
    accent: '#18181b',
    accentText: '#fafafa',
  },
};

type Theme = (typeof palette)[keyof typeof palette];
export type ThemeTransitionData = {
  color: string;
  x: number;
  y: number;
  nextIsDark: boolean;
};
type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  transition: ThemeTransitionData | null;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  applyTransitionTheme: (nextIsDark: boolean) => void;
  finishTransition: () => void;
  themeProgress: SharedValue<number>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const { width, height } = Dimensions.get('window');

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState(true);
  const [drop, setDrop] = useState<ThemeTransitionData | null>(null);
  const themeProgress = useSharedValue(0);
  const theme = isDark ? palette.dark : palette.light;

  const applyTransitionTheme = useCallback((nextIsDark: boolean) => {
    setIsDark(nextIsDark);
  }, []);
  const finishTransition = useCallback(() => setDrop(null), []);

  useEffect(() => {
    if (drop) {
      themeProgress.value = withTiming(drop.nextIsDark ? 0 : 1, { duration: 460 });
    }
  }, [drop, themeProgress]);

  function toggleTheme(origin = { x: width - 44, y: 56 }) {
    if (drop) {
      return;
    }

    const nextTheme = isDark ? palette.light : palette.dark;
    setDrop({
      color: nextTheme.background,
      x: origin.x,
      y: origin.y,
      nextIsDark: !isDark,
    });
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        transition: drop,
        toggleTheme,
        applyTransitionTheme,
        finishTransition,
        themeProgress,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return context;
}

export function useAnimatedThemeColor(darkColor: string, lightColor: string) {
  const { themeProgress } = useAppTheme();

  return useAnimatedStyle(() => ({
    color: interpolateColor(themeProgress.value, [0, 1], [darkColor, lightColor]),
  }));
}

export function useAnimatedThemeBackground(darkColor: string, lightColor: string) {
  const { themeProgress } = useAppTheme();

  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(themeProgress.value, [0, 1], [darkColor, lightColor]),
  }));
}

export function useAnimatedThemeBorder(darkColor: string, lightColor: string) {
  const { themeProgress } = useAppTheme();

  return useAnimatedStyle(() => ({
    borderColor: interpolateColor(themeProgress.value, [0, 1], [darkColor, lightColor]),
  }));
}

export function ThemeTransition({
  color,
  x,
  y,
  onApply,
  nextIsDark,
  onFinish,
}: {
  color: string;
  x: number;
  y: number;
  onApply: (nextIsDark: boolean) => void;
  nextIsDark: boolean;
  onFinish: () => void;
}) {
  const scale = useState(() => new Animated.Value(0))[0];
  const opacity = useState(() => new Animated.Value(1))[0];
  const farthestCorner = Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y),
  );

  useEffect(() => {
    Animated.timing(scale, {
      toValue: (farthestCorner * 2) / 40,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      Animated.delay(80).start(() => {
        onApply(nextIsDark);
        Animated.sequence([
          Animated.delay(180),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start(onFinish);
      });
    });
  }, [farthestCorner, nextIsDark, onApply, onFinish, opacity, scale]);

  return (
    <Animated.View pointerEvents="none" style={[styles.modal, { opacity }]}>
        <Animated.View
          style={[styles.drop, { backgroundColor: color, left: x - 20, opacity: 0.32, top: y - 20, transform: [{ scale }] }]}
        />
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  drop: {
    borderRadius: 999,
    height: 40,
    position: 'absolute',
    width: 40,
  },
});
