import { Canvas, createPicture, PaintStyle, Picture, Skia } from '@shopify/react-native-skia';
import type { SkPicture } from '@shopify/react-native-skia';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { MODE_FRAMES, resolvePreset } from 'thinking-orbs/engine';
import type { OrbState } from 'thinking-orbs/engine';

export type { OrbState } from 'thinking-orbs/engine';

type ThinkingOrbProps = {
  state?: OrbState;
  size?: 64 | 20;
  speed?: number;
  dark?: boolean;
  paused?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

const labels: Record<OrbState, string> = {
  working: 'Working',
  searching: 'Searching',
  solving: 'Solving',
  listening: 'Listening',
  connecting: 'Connecting',
  weaving: 'Weaving',
  composing: 'Composing',
  breathing: 'Thinking',
  shaping: 'Shaping',
};

function nowSeconds() {
  const performance = globalThis.performance;
  return typeof performance?.now === 'function' ? performance.now() / 1000 : Date.now() / 1000;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}

function useAppActive() {
  const [active, setActive] = useState(AppState.currentState !== 'background');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setActive(state !== 'background'));
    return () => subscription.remove();
  }, []);

  return active;
}

export function ThinkingOrb({
  state = 'working',
  size = 64,
  speed = 1,
  dark = true,
  paused = false,
  accessibilityLabel,
  style,
}: ThinkingOrbProps) {
  const reducedMotion = useReducedMotion();
  const appActive = useAppActive();
  const [picture, setPicture] = useState<SkPicture | null>(null);
  const paints = useMemo(() => ({ fill: Skia.Paint(), stroke: Skia.Paint() }), []);
  const rgba = useRef(new Float32Array(4)).current;
  const { mode, speed: presetSpeed, opts } = useMemo(() => resolvePreset(state, size), [size, state]);
  const effectiveSpeed = presetSpeed * speed;

  useEffect(() => {
    const { fill, stroke } = paints;
    fill.setAntiAlias(true);
    stroke.setAntiAlias(true);
    stroke.setStyle(PaintStyle.Stroke);
    const buildFrame = MODE_FRAMES[mode];

    const setInk = (paint: typeof fill, white: number, alpha: number) => {
      const ink = Math.min(1, Math.max(0, white));
      const gray = Math.round((dark ? 1 - ink : ink) * 255) / 255;
      rgba[0] = gray;
      rgba[1] = gray;
      rgba[2] = gray;
      rgba[3] = alpha;
      paint.setColor(rgba);
    };

    const recordFrame = (time: number) => {
      const frame = buildFrame(size, time, opts);
      const nextPicture = createPicture((canvas) => {
        for (const line of frame.lines) {
          setInk(stroke, line.white, line.a ?? 1);
          stroke.setStrokeWidth(line.w);
          canvas.drawLine(line.x1, line.y1, line.x2, line.y2, stroke);
        }
        for (const dot of frame.dots) {
          setInk(fill, dot.white, dot.a ?? 1);
          canvas.drawCircle(dot.x, dot.y, dot.r, fill);
        }
      }, Skia.XYWHRect(0, 0, size, size));
      setPicture(nextPicture);
    };

    if (reducedMotion) {
      recordFrame(0.6);
      return;
    }

    recordFrame(nowSeconds() * effectiveSpeed);
    if (paused || !appActive) return;

    let animationFrame = 0;
    let running = true;
    const animate = () => {
      recordFrame(nowSeconds() * effectiveSpeed);
      if (running) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [appActive, dark, effectiveSpeed, mode, opts, paints, paused, reducedMotion, rgba, size]);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? labels[state]}
      style={[{ height: size, width: size }, style]}
    >
      <Canvas style={{ height: size, width: size }}>
        {picture ? <Picture picture={picture} /> : null}
      </Canvas>
    </View>
  );
}
