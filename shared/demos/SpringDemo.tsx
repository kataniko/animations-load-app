import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';

const presets = [
  { label: 'Stiff', damping: 24, stiffness: 260 },
  { label: 'Smooth', damping: 20, stiffness: 100 },
  { label: 'Elastic', damping: 7, stiffness: 180 },
];

export function SpringDemo() {
  const { theme } = useAppTheme();
  const [preset, setPreset] = useState(2);
  const [width, setWidth] = useState(0);
  const [end, setEnd] = useState(false);
  const timing = useSharedValue(0);
  const spring = useSharedValue(0);
  const timingStyle = useAnimatedStyle(() => ({ transform: [{ translateX: timing.value }] }));
  const springStyle = useAnimatedStyle(() => ({ transform: [{ translateX: spring.value }] }));

  function race() {
    const target = end ? 0 : Math.max(0, width - 88);
    setEnd(!end);
    timing.set(withTiming(target, { duration: 700 }));
    spring.set(withSpring(target, { damping: presets[preset].damping, stiffness: presets[preset].stiffness }));
  }

  return (
    <>
      <Copy>Timing · 700 ms</Copy>
      <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[s.lane, { backgroundColor: theme.surfaceElevated, paddingHorizontal: 8 }]}>
        <Animated.View style={[s.ball, { backgroundColor: theme.textMuted }, timingStyle]} />
      </View>
      <Copy>Spring · damping {presets[preset].damping} · stiffness {presets[preset].stiffness}</Copy>
      <View style={[s.lane, { backgroundColor: theme.surfaceElevated, paddingHorizontal: 8 }]}>
        <Animated.View style={[s.ball, { backgroundColor: theme.accent }, springStyle]} />
      </View>
      <View style={s.row}>
        {presets.map((item, index) => <Action key={item.label} label={item.label} selected={preset === index} onPress={() => setPreset(index)} />)}
      </View>
      <Action label="Race both lanes" selected onPress={race} />
      <Copy>Visualizing damping impact on oscillation. Lower damping yields more spring bounce.</Copy>
    </>
  );
}
