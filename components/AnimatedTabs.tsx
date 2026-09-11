import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Easing, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { GRADIENT_PRESETS, GradientPreset } from '@/constants/gradient-presets';
import { AnimatedGradientText } from '@/components/AnimatedGradientText';

type AnimatedTabOption<Value extends string> = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  label: string;
  preset?: GradientPreset;
  value: Value;
};

type AnimatedTabsProps<Value extends string> = {
  effect?: 'accent' | 'gradient' | 'minimal';
  options: readonly AnimatedTabOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function AnimatedTabs<Value extends string>({ effect = 'gradient', options, value, onChange }: AnimatedTabsProps<Value>) {
  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {options.map((option) => (
        <AnimatedTab key={option.value} {...option} effect={effect} isActive={value === option.value} onPress={onChange} />
      ))}
    </View>
  );
}

function AnimatedTab<Value extends string>({ icon, label, preset = 'aural', value, effect, isActive, onPress }: AnimatedTabOption<Value> & {
  effect: 'accent' | 'gradient' | 'minimal';
  isActive: boolean;
  onPress: (value: Value) => void;
}) {
  const [lineWidth, setLineWidth] = useState(0);
  const progress = useSharedValue(isActive ? 1 : 0);
  const sweep = useSharedValue(0);
  const activeColor = GRADIENT_PRESETS[preset].accent;

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 280, easing: Easing.out(Easing.cubic) });
  }, [isActive, progress]);

  useEffect(() => {
    if (!isActive || effect !== 'gradient' || !lineWidth) return;
    sweep.value = withRepeat(withTiming(1, { duration: 4200, easing: Easing.linear }), -1, false);
  }, [effect, isActive, lineWidth, sweep]);

  const lineStyle = useAnimatedStyle(() => ({ opacity: progress.value, transform: [{ scaleX: progress.value }] }));
  const sweepStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -lineWidth * 2 + sweep.value * lineWidth * 2 }] }));
  const gradientColors = [...GRADIENT_PRESETS[preset].colors, ...GRADIENT_PRESETS[preset].colors, ...GRADIENT_PRESETS[preset].colors] as [string, string, ...string[]];

  function handleLayout(event: LayoutChangeEvent) {
    setLineWidth(event.nativeEvent.layout.width);
  }

  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: isActive }} onPress={() => onPress(value)} style={styles.tab}>
      <View style={styles.labelRow}>
        {icon && <MaterialIcons color={isActive && effect !== 'minimal' ? activeColor : '#71717A'} name={icon} size={14} />}
        {isActive && effect === 'gradient' ? (
          <AnimatedGradientText preset={preset} style={styles.label}>{label}</AnimatedGradientText>
        ) : (
          <Text style={[styles.label, { color: isActive && effect === 'accent' ? activeColor : isActive ? '#E4E4E7' : '#71717A' }]}>{label}</Text>
        )}
      </View>
      <Animated.View onLayout={handleLayout} style={[styles.line, lineStyle]}>
        {effect === 'gradient' ? (
          <Animated.View style={[styles.sweep, { width: lineWidth * 3 }, sweepStyle]}>
            <LinearGradient colors={gradientColors} end={{ x: 1, y: 0 }} start={{ x: 0, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: effect === 'accent' ? activeColor : '#E4E4E7' }]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: { borderBottomColor: '#27272A', borderBottomWidth: 1, flexDirection: 'row', height: 44 },
  tab: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  labelRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  label: { fontSize: 12, fontWeight: '800', lineHeight: 16 },
  line: { bottom: 0, height: 2, left: 0, overflow: 'hidden', position: 'absolute', right: 0 },
  sweep: { height: '100%' },
});
