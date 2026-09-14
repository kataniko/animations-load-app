import { useAppTheme } from '@/context/ThemeContext';
import tw from '@/shared/tailwind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurTargetView, BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const COLLAPSED_WIDTH = 178;
const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 380;
const ACTION_SIZE = 42;

const SPRING_CONFIG = {
  damping: 16,
  stiffness: 180,
  mass: 0.7,
};

export function ExerciceResolution() {
  const { theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width - 48, 340);
  const blurTargetRef = useRef<View>(null);

  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(expanded ? 1 : 0, SPRING_CONFIG);
  }, [expanded, progress]);

  useEffect(() => {
    if (!expanded) {
      dragY.value = withSpring(0);
    }
  }, [dragY, expanded]);

  function close() {
    setExpanded(false);
  }

  const panGesture = Gesture.Pan()
    .enabled(expanded)
    .onUpdate((event) => {
      // eslint-disable-next-line react-hooks/immutability
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 90 || event.velocityY > 750) {
        scheduleOnRN(close);
      } else {
        // eslint-disable-next-line react-hooks/immutability
        dragY.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const surfaceStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [COLLAPSED_WIDTH, panelWidth]),
    height: interpolate(progress.value, [0, 1], [COLLAPSED_HEIGHT, EXPANDED_HEIGHT]),
    transform: [{ translateY: dragY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const compactNavStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: progress.value * 12 }],
  }));

  const expandedContentStyle = useAnimatedStyle(() => ({
    // Durante o drag, o conteúdo desaparece progressivamente em vez de sumir de repente.
    opacity: progress.value * interpolate(dragY.value, [0, 280], [1, 0.18]),
    transform: [
      { translateY: 18 * (1 - progress.value) },
      { scale: 0.96 + progress.value * 0.04 },
    ],
  }));

  const actionButtonStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [ACTION_SIZE, panelWidth - 32]),
    height: interpolate(progress.value, [0, 1], [ACTION_SIZE, 48]),
    borderRadius: interpolate(progress.value, [0, 1], [ACTION_SIZE / 2, 22]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    position: 'absolute',
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));

  const continueStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: 6 * (1 - progress.value) }],
  }));

  return (
    <View style={[tw`h-[420px] overflow-hidden relative items-center justify-end pb-[14px] rounded-[20px]`, { backgroundColor: theme.surfaceElevated }]}>
      <BlurTargetView ref={blurTargetRef} pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[tw`absolute w-[150px] h-[150px] rounded-full opacity-30 top-[42px] left-[24px]`, { backgroundColor: theme.accent }]} />
        <View style={[tw`absolute w-[150px] h-[150px] rounded-full opacity-30 right-[18px] top-[126px]`, { backgroundColor: '#8b5cf6' }]} />
        <View style={[tw`absolute w-[190px] h-[120px] rounded-[22px] border opacity-35 right-[26px] top-[48px]`, { backgroundColor: theme.surface, borderColor: theme.border, transform: [{ rotate: '8deg' }] }]} />
      </BlurTargetView>
      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, tw`z-1`, backdropStyle]}
      >
        {/* Only close when tapping outside; the blur stays inside the bottom sheet. */}
        <Pressable onPress={close} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.View
        style={[
          tw`rounded-[24px] border overflow-hidden items-center justify-end relative z-2`,
          {
            borderColor: theme.border,
          },
          surfaceStyle,
        ]}
      >
        <BlurView
          pointerEvents="none"
          blurTarget={blurTargetRef}
          blurMethod="dimezisBlurView"
          intensity={25}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.35)',
            },
          ]}
        />

        <Animated.View
          pointerEvents={expanded ? 'none' : 'auto'}
          style={[tw`absolute bottom-0 left-0 right-0 h-[56px] flex-row items-center justify-center gap-2 px-[10px]`, compactNavStyle]}
        >
          <View style={tw`w-[44px] h-[44px] rounded-full items-center justify-center`}>
            <MaterialIcons name="home" size={20} color={theme.accent} />
          </View>
          <View style={{ width: ACTION_SIZE }} />
          <View style={tw`w-[44px] h-[44px] rounded-full items-center justify-center`}>
            <MaterialIcons name="auto-awesome-motion" size={20} color={theme.textMuted} />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents={expanded ? 'auto' : 'none'}
          style={[tw`absolute top-0 left-0 right-0 p-4 pb-[76px]`, expandedContentStyle]}
        >
          <GestureDetector gesture={panGesture}>
            <View style={tw`h-[18px] items-center justify-center mb-[6px]`}>
              <View style={tw`w-[42px] h-[5px] rounded-[3px] bg-white/40`} />
            </View>
          </GestureDetector>

          <View style={tw`flex-row items-center justify-between mb-3`}>
            <View style={{ width: 28 }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={[tw`text-[18px] font-black`, { color: theme.text }]}>Create Motion</Text>
              <Text style={[tw`text-xs font-bold`, { color: theme.textMuted }]}>Reanimated · wizard</Text>
            </View>
            <Pressable onPress={close} hitSlop={12} style={tw`p-1`}>
              <MaterialIcons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          <Text style={[tw`text-xs font-bold mb-[6px]`, { color: theme.textMuted }]}>Select animation</Text>
          <View style={tw`flex-row gap-[6px] mb-[14px]`}>
            <View style={[tw`flex-1 h-1 rounded-[2px]`, { backgroundColor: theme.accent }]} />
            <View style={[tw`flex-1 h-1 rounded-[2px]`, { backgroundColor: theme.border }]} />
            <View style={[tw`flex-1 h-1 rounded-[2px]`, { backgroundColor: theme.border }]} />
          </View>

          <View style={tw`flex-row flex-wrap gap-2`}>
            {['Feed reveal', 'Like burst', 'Story ring', '3D scene'].map((opt, i) => (
              <View
                key={opt}
                style={[
                  tw`px-[14px] py-[10px] rounded-[14px] border`,
                  {
                    backgroundColor: i === 0 ? theme.accent : theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[tw`text-xs font-extrabold`, { color: i === 0 ? theme.accentText : theme.text }]}>
                  {opt}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded((prev) => !prev)}
          style={[tw`items-center h-[54px] justify-center z-4`, { width: expanded ? panelWidth : ACTION_SIZE }]}
        >
          <Animated.View
            style={[
              tw`items-center justify-center overflow-hidden`,
              { backgroundColor: theme.accent },
              actionButtonStyle,
            ]}
          >
            <Animated.View style={plusStyle}>
              <MaterialIcons name="add" size={24} color={theme.accentText} />
            </Animated.View>
            <Animated.View style={[tw`items-center flex-row gap-[6px] justify-center`, continueStyle]}>
              <Text style={[tw`text-sm font-black`, { color: theme.accentText }]}>Continue</Text>
              <MaterialIcons name="chevron-right" size={22} color={theme.accentText} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

