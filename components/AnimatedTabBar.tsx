import { appColors } from '@/constants/AppColors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const CIRCLE_SIZE = 58;
const BAR_SIDE_MARGIN = 24;
const BAR_HORIZONTAL_PADDING = 12;
const BAR_HEIGHT = 70;
const BAR_RADIUS = 24;
const NOTCH_RADIUS = 44;
const NOTCH_DEPTH = 34;

const actionItems: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: 'edit', label: 'Post' },
  { icon: 'photo-camera', label: 'Story' },
  { icon: 'auto-awesome', label: 'Motion' },
];

const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  index: 'home',
  search: 'donut-large',
  notifications: 'add',
  profile: 'person-outline',
  explore: 'auto-awesome-motion',
};

type AnimatedTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string } }>;
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
};

export function AnimatedTabBar({ state, descriptors, navigation }: AnimatedTabBarProps) {
  const [expanded, setExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const barWidth = width - BAR_SIDE_MARGIN * 2;
  const itemWidth = (barWidth - BAR_HORIZONTAL_PADDING * 2) / state.routes.length;
  const actionIndex = Math.floor(state.routes.length / 2);
  const actionX = getCircleX(actionIndex, itemWidth);
  const selectedIndex = expanded ? actionIndex : state.index;
  const activeX = useSharedValue(getCircleX(state.index, itemWidth));
  const expandProgress = useSharedValue(0);
  const bottomInset = Math.max(insets.bottom, 10);

  const actionCenter = useMemo(
    () => BAR_SIDE_MARGIN + actionX + CIRCLE_SIZE / 2,
    [actionX]
  );

  useEffect(() => {
    activeX.value = withSpring(getCircleX(selectedIndex, itemWidth), {
      damping: 18,
      stiffness: 170,
      mass: 0.7,
    });
  }, [activeX, itemWidth, selectedIndex]);

  useEffect(() => {
    expandProgress.value = withSpring(expanded ? 1 : 0, {
      damping: 16,
      stiffness: 170,
      mass: 0.75,
    });
  }, [expanded, expandProgress]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value }],
  }));

  const actionMenuStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
    transform: [
      { translateY: 18 * (1 - expandProgress.value) },
      { scale: 0.86 + expandProgress.value * 0.14 },
    ],
  }));

  const barPathProps = useAnimatedProps(() => ({
    d: getNotchedBarPath(barWidth, activeX.value + CIRCLE_SIZE / 2),
  }));

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomInset }]}> 
      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[styles.actionMenu, { left: actionCenter - 126 }, actionMenuStyle]}>
        {actionItems.map((item) => (
          <Pressable key={item.label} style={styles.actionBubble} onPress={() => setExpanded(false)}>
            <MaterialIcons name={item.icon} size={20} color={appColors.text} />
            <Text style={styles.actionLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </Animated.View>
      <View style={[styles.bar, { width: barWidth }]}>
        <Svg
          height={BAR_HEIGHT}
          pointerEvents="none"
          style={styles.barShape}
          viewBox={`0 0 ${barWidth} ${BAR_HEIGHT}`}
          width={barWidth}>
          <AnimatedPath
            animatedProps={barPathProps}
            fill="#101010"
            stroke={appColors.border}
            strokeWidth={1}
          />
        </Svg>
        <Animated.View style={[styles.activeCircle, circleStyle]} />
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor.options;
          const isActionTab = index === actionIndex;
          const focused = isActionTab ? expanded : state.index === index;
          const icon = icons[route.name] ?? 'circle';

          function onPress() {
            if (isActionTab) {
              setExpanded((current) => !current);
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            setExpanded(false);

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          return (
            <Pressable
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              key={route.key}
              onPress={onPress}
              style={[styles.item, { width: itemWidth }]}>
              <AnimatedTabIcon focused={focused} icon={icon} isAction={isActionTab} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function AnimatedTabIcon({
  focused,
  icon,
  isAction,
}: {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  isAction: boolean;
}) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration: 220 });
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(focused ? -27 : 0, { damping: 150, stiffness: 180 }) },
      { scale: withSpring(isAction ? 1.18 : focused ? 1.08 : 1, { damping: 150, stiffness: 180 }) },
      { rotate: isAction ? `${progress.value * 45}deg` : '0deg' },
    ],
  }));

  const iconColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [isAction ? appColors.text : appColors.tabInactive, appColors.text]),
  }));

  return (
    <Animated.View style={[styles.iconWrap, iconStyle]}>
      <AnimatedMaterialIcon name={icon} size={26} style={iconColorStyle} />
    </Animated.View>
  );
}

function getCircleX(index: number, itemWidth: number) {
  return BAR_HORIZONTAL_PADDING + itemWidth * index + itemWidth / 2 - CIRCLE_SIZE / 2;
}

function getNotchedBarPath(barWidth: number, centerX: number) {
  'worklet';

  const notchStart = Math.max(BAR_RADIUS, centerX - NOTCH_RADIUS);
  const notchEnd = Math.min(barWidth - BAR_RADIUS, centerX + NOTCH_RADIUS);
  const leftSpan = centerX - notchStart;
  const rightSpan = notchEnd - centerX;

  return [
    `M ${BAR_RADIUS} 0`,
    `H ${notchStart}`,
    `C ${notchStart + leftSpan * 0.35} 0 ${centerX - leftSpan * 0.72} ${NOTCH_DEPTH} ${centerX} ${NOTCH_DEPTH}`,
    `C ${centerX + rightSpan * 0.72} ${NOTCH_DEPTH} ${notchEnd - rightSpan * 0.35} 0 ${notchEnd} 0`,
    `H ${barWidth - BAR_RADIUS}`,
    `Q ${barWidth} 0 ${barWidth} ${BAR_RADIUS}`,
    `V ${BAR_HEIGHT - BAR_RADIUS}`,
    `Q ${barWidth} ${BAR_HEIGHT} ${barWidth - BAR_RADIUS} ${BAR_HEIGHT}`,
    `H ${BAR_RADIUS}`,
    `Q 0 ${BAR_HEIGHT} 0 ${BAR_HEIGHT - BAR_RADIUS}`,
    `V ${BAR_RADIUS}`,
    `Q 0 0 ${BAR_RADIUS} 0`,
    'Z',
  ].join(' ');
}

const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcons);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: BAR_HEIGHT,
    justifyContent: 'center',
    overflow: 'visible',
    paddingHorizontal: BAR_HORIZONTAL_PADDING,
  },
  barShape: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  actionMenu: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderColor: appColors.border,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    position: 'absolute',
    top: -76,
    width: 252,
    zIndex: 5,
  },
  actionBubble: {
    alignItems: 'center',
    backgroundColor: appColors.glass,
    borderColor: appColors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 3,
    height: 58,
    justifyContent: 'center',
    width: 72,
  },
  actionLabel: {
    color: appColors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  activeCircle: {
    alignItems: 'center',
    backgroundColor: appColors.orange,
    borderColor: appColors.text,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    height: CIRCLE_SIZE,
    left: 0,
    position: 'absolute',
    top: -19,
    width: CIRCLE_SIZE,
    zIndex: 2,
  },
  item: {
    alignItems: 'center',
    borderLeftColor: appColors.tabDivider,
    borderLeftWidth: 1,
    height: BAR_HEIGHT,
    justifyContent: 'center',
    zIndex: 3,
  },
  iconWrap: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
});
