import { BlurMask, Canvas, DashPathEffect, Paint, RoundedRect, SweepGradient } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { cancelAnimation, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type BorderBeamProps = {
  children: ReactNode;
  size?: 'md' | 'sm' | 'line' | 'pulse-inner' | 'pulse-outside';
  colorVariant?: 'colorful' | 'mono' | 'ocean' | 'sunset';
  strength?: number;
  active?: boolean;
  theme?: 'light' | 'dark';
  borderRadius?: number;
};

const palettes: Record<NonNullable<BorderBeamProps['colorVariant']>, string[]> = {
  colorful: ['transparent', '#32c850', '#1eb9aa', 'transparent', '#288cff', '#ff3264', 'transparent', '#6446ff', '#288cff', 'transparent', '#ff7828', '#f032b4', '#b428f0', 'transparent', 'transparent'],
  mono: ['transparent', '#a0a0a0', '#828282', 'transparent', '#969696', '#bebebe', 'transparent', '#aaaaaa', '#969696', 'transparent', '#b4b4b4', '#919191', '#a5a5a5', 'transparent', 'transparent'],
  ocean: ['transparent', '#5080dc', '#328cdc', 'transparent', '#467dff', '#6450dc', 'transparent', '#7850ff', '#4682ff', 'transparent', '#8c64f0', '#5a6ee6', '#8246ff', 'transparent', 'transparent'],
  sunset: ['transparent', '#ffb432', '#ff9630', 'transparent', '#ffb43c', '#ff5032', 'transparent', '#ff6450', '#ffb43c', 'transparent', '#ff3c3c', '#ff8c32', '#ff5a46', 'transparent', 'transparent'],
};

const palettePositions = [0, 0.05, 0.1, 0.16, 0.23, 0.3, 0.37, 0.45, 0.53, 0.61, 0.69, 0.77, 0.84, 0.92, 1];
const innerGlowLayers = [
  { blur: 26, opacity: 0.16, strokeWidth: 58 },
  { blur: 18, opacity: 0.3, strokeWidth: 42 },
  { blur: 9, opacity: 0.58, strokeWidth: 16 },
];
const innerCanvasMargin = 48;
const BeamProgressContext = createContext<SharedValue<number> | null>(null);

export function BorderBeam({
  children,
  size = 'md',
  colorVariant = 'colorful',
  strength = 0.7,
  active = true,
  theme: _theme = 'dark',
  borderRadius = 18,
}: BorderBeamProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const progress = useSharedValue(0);
  const gradientTransform = useDerivedValue(() => [{ rotate: progress.value * Math.PI * 2 }]);
  const strokeWidth = size === 'line' ? 1 : size === 'sm' ? 1.5 : 2;
  const duration = size === 'pulse-inner' || size === 'pulse-outside' ? 1800 : 4200;
  const opacity = Math.max(0, Math.min(1, strength));
  const radius = Math.max(0, borderRadius - strokeWidth);
  const perimeter = Math.max(1, 2 * (layout.width + layout.height - 4 * radius) + 2 * Math.PI * radius);
  const beamLength = perimeter * 0.58;
  const dashIntervals = [beamLength, perimeter - beamLength];
  const phaseA = useDerivedValue(() => -progress.value * perimeter);

  useEffect(() => {
    if (!layout.width || !active) {
      cancelAnimation(progress);
      return;
    }
    progress.value = withRepeat(withTiming(1, { duration }), -1, false);
    return () => cancelAnimation(progress);
  }, [active, duration, layout.width, progress]);

  return (
    <BeamProgressContext.Provider value={progress}>
      <View
        onLayout={({ nativeEvent: { layout: next } }) => setLayout({ width: next.width, height: next.height })}
        style={[styles.wrapper, { borderRadius }]}
      >
        {layout.width > 0 && (
          <Canvas opaque={false} pointerEvents="none" style={[StyleSheet.absoluteFill, styles.canvas]}>
            <RoundedRect x={strokeWidth} y={strokeWidth} width={layout.width - strokeWidth * 2} height={layout.height - strokeWidth * 2} r={borderRadius - strokeWidth}>
              <Paint style="stroke" strokeCap="round" strokeWidth={strokeWidth * 8} opacity={opacity * 0.24}>
                <BlurMask blur={10} respectCTM style="normal" />
                <DashPathEffect intervals={dashIntervals} phase={phaseA} />
                <SweepGradient c={{ x: layout.width / 2, y: layout.height / 2 }} colors={palettes[colorVariant]} positions={palettePositions} transform={gradientTransform} />
              </Paint>
            </RoundedRect>
          </Canvas>
        )}
        {children}
      </View>
    </BeamProgressContext.Provider>
  );
}

export function InnerBeamGlow({
  colorVariant = 'colorful',
  strength = 0.7,
  active = true,
  borderRadius = 16,
}: Pick<BorderBeamProps, 'colorVariant' | 'strength' | 'active' | 'borderRadius'>) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const inheritedProgress = useContext(BeamProgressContext);
  const fallbackProgress = useSharedValue(0);
  const progress = inheritedProgress ?? fallbackProgress;
  const gradientTransform = useDerivedValue(() => [{ rotate: progress.value * Math.PI * 2 }]);
  const opacity = Math.max(0, Math.min(1, strength));

  useEffect(() => {
    if (inheritedProgress || !layout.width) {
      return;
    }
    if (!active) {
      cancelAnimation(fallbackProgress);
      return;
    }
    fallbackProgress.value = withRepeat(withTiming(1, { duration: 4200 }), -1, false);
    return () => cancelAnimation(fallbackProgress);
  }, [active, fallbackProgress, inheritedProgress, layout.width]);

  return (
    <View
      pointerEvents="none"
      onLayout={({ nativeEvent: { layout: next } }) => setLayout({ width: next.width, height: next.height })}
      style={styles.innerGlow}
    >
      {layout.width > 0 && (
        <Canvas opaque={false} pointerEvents="none" style={[StyleSheet.absoluteFill, styles.innerCanvas]}>
          {innerGlowLayers.map((layer) => (
            <RoundedRect
              key={layer.strokeWidth}
              x={innerCanvasMargin + 1}
              y={innerCanvasMargin + 1}
              width={layout.width - (innerCanvasMargin + 1) * 2}
              height={layout.height - (innerCanvasMargin + 1) * 2}
              r={Math.max(2, borderRadius - 1)}
            >
              <Paint blendMode="screen" style="stroke" strokeWidth={layer.strokeWidth} opacity={opacity * layer.opacity}>
                <BlurMask blur={layer.blur} respectCTM style="normal" />
                <SweepGradient c={{ x: layout.width / 2, y: layout.height / 2 }} colors={palettes[colorVariant]} positions={palettePositions} transform={gradientTransform} />
              </Paint>
            </RoundedRect>
          ))}
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: 'transparent' },
  innerCanvas: { mixBlendMode: 'screen' },
  innerGlow: { bottom: -innerCanvasMargin, left: -innerCanvasMargin, position: 'absolute', right: -innerCanvasMargin, top: -innerCanvasMargin, zIndex: 2 },
  wrapper: { overflow: 'hidden', padding: 2, position: 'relative', width: '100%' },
});
