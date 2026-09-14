import { Canvas, Group, Paint } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { cancelAnimation, Easing, useDerivedValue, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { BeamComposition, beamColorMatrix, beamPresets } from './BeamComposition';
import type { beamColors } from './BeamComposition';

type BorderBeamProps = {
  children: ReactNode;
  // Only md is ported; the upstream line/sm/pulse effects have different compositions.
  size?: 'md';
  colorVariant?: keyof typeof beamColors;
  strength?: number;
  active?: boolean;
  theme?: keyof typeof beamPresets;
  borderRadius?: number;
};

export function BorderBeam({
  children,
  colorVariant = 'colorful',
  strength = 0.7,
  active = true,
  theme = 'dark',
  borderRadius = 16,
}: BorderBeamProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();
  const angle = useSharedValue(0);
  const hue = useSharedValue(-30);
  const visibility = useSharedValue(0);
  const ready = layout.width > 2 && layout.height > 2;
  const saturation = beamPresets[theme].saturation;
  const mono = colorVariant === 'mono';
  const opacity = useDerivedValue(() => Math.max(0, Math.min(1, strength)) * visibility.value);
  // CSS conic gradients start at 12 o'clock; Skia sweep gradients start at 3.
  const rotation = useDerivedValue(() => [{ rotate: angle.value * Math.PI * 2 - Math.PI / 2 }]);
  const colorMatrix = useDerivedValue(() => beamColorMatrix(mono ? 0 : hue.value, saturation));

  useEffect(() => {
    visibility.value = withTiming(active && ready ? 1 : 0, { duration: reducedMotion ? 0 : active ? 600 : 500 });
    if (ready && active && !reducedMotion) {
      angle.value = 0;
      angle.value = withRepeat(withTiming(1, { duration: 1960, easing: Easing.linear }), -1, false);
      if (!mono) {
        hue.value = -30;
        hue.value = withRepeat(withTiming(30, { duration: 6000, easing: Easing.inOut(Easing.ease) }), -1, true);
      }
    }
    return () => {
      cancelAnimation(angle);
      cancelAnimation(hue);
      cancelAnimation(visibility);
    };
  }, [active, ready, reducedMotion, mono, angle, hue, visibility]);

  return (
    <View onLayout={({ nativeEvent: { layout: next } }) => setLayout({ width: next.width, height: next.height })}
      style={[styles.wrapper, { borderRadius }]}>
      {children}
      {ready && (
        <Canvas opaque={false} pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Group layer={<Paint opacity={opacity} />}>
            <BeamComposition {...layout} borderRadius={borderRadius} colorVariant={colorVariant} theme={theme}
              rotation={rotation} colorMatrix={colorMatrix} />
          </Group>
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', position: 'relative', width: '100%' },
});
