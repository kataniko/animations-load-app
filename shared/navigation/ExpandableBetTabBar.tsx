import { appColors } from '@/constants/AppColors';
import {
  useAnimatedThemeBackground,
  useAnimatedThemeColor,
  useAppTheme,
} from '@/context/ThemeContext';
import { AddGlow } from '@/shared/effects/AddGlow';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurTargetView, BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

const steps = [
  {
    label: 'Select animation',
    helper: 'What should we demonstrate?',
    options: ['Feed reveal', 'Like burst', 'Story ring', '3D scene'],
  },
  {
    label: 'Select trigger',
    helper: 'How should the animation start?',
    options: ['On tap', 'On scroll', 'On gesture', 'On load'],
  },
  {
    label: 'Select feel',
    helper: 'What should the motion feel like?',
    options: ['Snappy', 'Smooth', 'Bouncy', 'Elastic'],
  },
];

const COLLAPSED_WIDTH = 178;
const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 448;
const ACTION_SIZE = 42;

type TabRoute = { key: string; name: string; params?: object };

type ExpandableBetTabBarProps = {
  state: {
    index: number;
    routes: TabRoute[];
  };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string } }>;
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
};

function ExpandableBetTabBar({ state, descriptors, navigation }: ExpandableBetTabBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { theme, isDark } = useAppTheme();
  const actionBackgroundStyle = useAnimatedThemeBackground('#27272a', '#09090b');
  const actionTextStyle = useAnimatedThemeColor('#ffffff', '#ffffff');
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const bottomInset = Math.max(insets.bottom, 10);
  const panelWidth = Math.min(width - 16, 384);
  const homeRoute = state.routes.find((route) => route.name === 'index') ?? state.routes[0];
  const labRoute = state.routes.find((route) => route.name === 'explore') ?? state.routes[state.routes.length - 1];
  const currentStep = steps[step];
  const selectedOption = selectedOptions[step];
  const dragY = useSharedValue(0);
  const blurTargetRef = useRef<View>(null);

  useEffect(() => {
    progress.value = withSpring(expanded ? 1 : 0, {
      damping: 16,
      stiffness: 180,
      mass: 0.7,
    });
  }, [expanded, progress]);

  useEffect(() => {
    if (!expanded) {
      dragY.value = withSpring(0);
    }
  }, [dragY, expanded]);

  const surfaceStyle = useAnimatedStyle(() => ({
    borderRadius: 24,
    height: interpolate(progress.value, [0, 1], [COLLAPSED_HEIGHT, EXPANDED_HEIGHT]),
    width: interpolate(progress.value, [0, 1], [COLLAPSED_WIDTH, panelWidth]),
  }));

  const compactNavStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: progress.value * 12 }],
  }));

  const expandedContentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: 18 * (1 - progress.value) },
      { scale: 0.96 + progress.value * 0.04 },
    ],
  }));

  const actionButtonStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [ACTION_SIZE / 2, 23]),
    height: interpolate(progress.value, [0, 1], [ACTION_SIZE, 50]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
    width: interpolate(progress.value, [0, 1], [ACTION_SIZE, panelWidth - 32]),
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

  const sheetDragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const panGesture = Gesture.Pan()
    .enabled(expanded)
    .onUpdate((event) => {
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 900) {
        scheduleOnRN(closePanel);
      } else {
        dragY.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  function closePanel() {
    setExpanded(false);
    setStep(0);
    setSelectedOptions([]);
  }

  function selectOption(option: string) {
    setSelectedOptions((current) => {
      const next = [...current];
      next[step] = option;
      return next;
    });
  }

  function navigateTo(route: TabRoute) {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    setExpanded(false);

    if (!event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomInset }]}>
      <BlurTargetView ref={blurTargetRef} pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View className='size-full' />
      </BlurTargetView>
      <Animated.View
        collapsable={false}
        pointerEvents="auto"
        style={[
          styles.surface,
          {
            borderColor: theme.border,
            borderWidth: 1,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.45)' : 'rgba(255, 255, 255, 0.65)',
          },
          surfaceStyle,
          sheetDragStyle,
        ]}
      >
        <BlurView
          pointerEvents="none"
          intensity={100}
          blurReductionFactor={1}
          tint={isDark ? 'dark' : 'light'}
          blurMethod={Platform.OS === 'android' && Number(Platform.Version) >= 31 ? 'dimezisBlurViewSdk31Plus' : 'dimezisBlurView'}
          blurTarget={blurTargetRef}
          style={[StyleSheet.absoluteFill, styles.blur]}
        />
        <Animated.View pointerEvents={expanded ? 'none' : 'auto'} style={[styles.compactNav, compactNavStyle]}>
          <NavButton
            active={state.routes[state.index]?.name === homeRoute.name && !expanded}
            icon="home"
            label={descriptors[homeRoute.key]?.options.tabBarAccessibilityLabel ?? 'Home'}
            onPress={() => navigateTo(homeRoute)}
          />

          <View style={styles.compactActionSlot} />

          <NavButton
            active={state.routes[state.index]?.name === labRoute.name && !expanded}
            icon="auto-awesome-motion"
            label={descriptors[labRoute.key]?.options.tabBarAccessibilityLabel ?? 'Lab'}
            onPress={() => navigateTo(labRoute)}
          />
        </Animated.View>

        <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.expandedContent, expandedContentStyle]}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>
          </GestureDetector>

          <View style={styles.panelHeader}>
            <View style={styles.closeSpacer} />
            <View style={styles.panelTitleBlock}>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Create Motion</Text>
              <Text style={styles.panelLibrary}>Reanimated · wizard</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={closePanel} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={theme.textMuted} />
            </Pressable>
          </View>

          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{currentStep.label}</Text>
          <View style={styles.stepRow}>
            {steps.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.stepSegment,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)' },
                  index <= step && { backgroundColor: theme.accent },
                ]}
              />
            ))}
          </View>

          <Text style={[styles.helperText, { color: theme.textMuted }]}>{currentStep.helper}</Text>

          <ScrollView
            bounces={false}
            contentContainerStyle={styles.leagueGrid}
            showsVerticalScrollIndicator={false}
            style={styles.optionsScroll}>
            {currentStep.options.map((option) => {
              const selected = selectedOption === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => selectOption(option)}
                  style={[
                    styles.leagueChip,
                    {
                      backgroundColor: selected ? theme.accent : theme.surfaceElevated,
                      borderColor: selected ? theme.accent : theme.border,
                    },
                  ]}>
                  <Text style={[styles.leagueText, { color: selected ? theme.accentText : theme.text }]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          disabled={expanded && !selectedOption}
          onPress={() => {
            if (!expanded) {
              setStep(0);
              setSelectedOptions([]);
              setExpanded(true);
              return;
            }

            if (!selectedOption) {
              return;
            }

            if (step < steps.length - 1) {
              setStep((current) => current + 1);
              return;
            }

            closePanel();
            if (selectedOptions[0] === '3D scene') {
              router.push('/three' as const);
            } else {
              router.push('/(tabs)/explore' as const);
            }
          }}
          style={[styles.actionButtonHitbox, { width: expanded ? panelWidth : ACTION_SIZE }]}>
          <Animated.View style={[styles.actionButton, { backgroundColor: theme.accent }, expanded && actionBackgroundStyle, expanded && !selectedOption && styles.continueButtonDisabled, actionButtonStyle]}>
            <Animated.View style={plusStyle}>
              {!expanded ? <AddGlow size={28} /> : <MaterialIcons name="add" size={24} color={theme.accentText} />}
            </Animated.View>
            <Animated.View style={[styles.continueContent, continueStyle]}>
              <Animated.Text style={[styles.continueText, actionTextStyle]}>{step === steps.length - 1 ? 'Open demo' : 'Continue'}</Animated.Text>
              <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default ExpandableBetTabBar;

function NavButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { isDark } = useAppTheme();
  const iconColor = active ? (isDark ? '#fafafa' : '#18181b') : (isDark ? '#a1a1aa' : '#71717a');
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 220 });
  }, [active, progress]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.08 }],
  }));

  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.navButton}>
      <Animated.View style={iconWrapStyle}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  surface: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    position: 'relative',
  },
  blur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurShape: {
    borderRadius: 999,
    opacity: 0.32,
    position: 'absolute',
  },
  blurShapeAccent: {
    height: 150,
    left: 18,
    top: 18,
    width: 150,
  },
  blurShapeSecondary: {
    bottom: 18,
    height: 130,
    right: 24,
    width: 180,
  },
  compactNav: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    height: COLLAPSED_HEIGHT,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
  },
  compactActionSlot: {
    height: ACTION_SIZE,
    width: ACTION_SIZE,
  },
  expandedContent: {
    left: 0,
    padding: 16,
    paddingBottom: 82,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  dragHandleArea: {
    alignItems: 'center',
    height: 18,
    justifyContent: 'center',
    marginBottom: 4,
  },
  dragHandle: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    borderRadius: 3,
    height: 5,
    width: 42,
  },
  panel: {
    backgroundColor: '#18181b',
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
    position: 'absolute',
    zIndex: 6,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  closeSpacer: {
    height: 36,
    width: 36,
  },
  panelTitleBlock: {
    alignItems: 'center',
  },
  panelTitle: {
    color: appColors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  panelLibrary: {
    color: appColors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  fieldLabel: {
    color: appColors.textMuted,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 22,
  },
  stepSegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 4,
    flex: 1,
    height: 4,
  },
  stepSegmentActive: {
    backgroundColor: '#fafafa',
  },
  helperText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  threeShortcut: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 178, 79, 0.12)',
    borderColor: 'rgba(255, 178, 79, 0.34)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  threeShortcutText: {
    color: '#fafafa',
    fontSize: 13,
    fontWeight: '900',
  },
  optionsScroll: {
    height: 170,
  },
  leagueGrid: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 18,
  },
  leagueChip: {
    alignItems: 'center',
    backgroundColor: '#363b40',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 19,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  leagueChipSelected: {
    backgroundColor: '#fafafa',
  },
  leagueText: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  leagueTextSelected: {
    color: '#171717',
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 23,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.82,
  },
  actionButtonHitbox: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 1,
    height: 54,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 8,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  continueContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
  },
  continueText: {
    color: '#171717',
    fontSize: 16,
    fontWeight: '900',
  },
  navPill: {
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 28,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: 178,
  },
  navButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  plusButton: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
});