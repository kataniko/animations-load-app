// Native port of border-beam 1.3.0's md CSS composition.
// Copyright (c) 2026 Jakub Antalik — MIT; see border-beam.LICENSE.
import { Box, BoxShadow, Circle, ColorMatrix, Group, LinearGradient, Paint, RadialGradient, Rect, SweepGradient, Blur } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

export const beamColors = {
  colorful: ['#ff3264', '#288cff', '#32c850', '#1eb9aa', '#6446ff', '#288cff', '#ff7828', '#f032b4', '#b428f0'],
  mono: ['#b4b4b4', '#8c8c8c', '#a0a0a0', '#828282', '#aaaaaa', '#969696', '#bebebe', '#919191', '#a5a5a5'],
  ocean: ['#6450dc', '#3c78ff', '#5064c8', '#328cdc', '#7850ff', '#4682ff', '#8c64f0', '#5a6ee6', '#8246ff'],
  sunset: ['#ff5032', '#ffa028', '#ff783c', '#ffc832', '#ff6450', '#ffb43c', '#ff3c3c', '#ff8c32', '#ff5a46'],
} as const;

// CSS ellipse radii in logical pixels; locations are fractions of the card size.
export const beamLights = [
  { x: 0.33, y: -0.074, rx: 70, ry: 40 },
  { x: 0.12, y: -0.05, rx: 60, ry: 35 },
  { x: 0.021, y: 0.683, rx: 40, ry: 70 },
  { x: 0.021, y: 0.683, rx: 20, ry: 35 },
  { x: 0.744, y: 1, rx: 180, ry: 32 },
  { x: 0.55, y: 1, rx: 85, ry: 26 },
  { x: 0.939, y: 0, rx: 74, ry: 32 },
  { x: 1, y: 0.271, rx: 26, ry: 42 },
  { x: 1, y: 0.271, rx: 52, ry: 48 },
] as const;

export const beamPresets = {
  dark: { stroke: 0.26, inner: 0.42, bloom: 0.24, saturation: 1.2, shadow: 'rgba(255,255,255,0.27)' },
  light: { stroke: 0.12, inner: 0.26, bloom: 0.34, saturation: 1.5, shadow: 'rgba(0,0,0,0.14)' },
};

// CSS hue-rotate -> brightness -> saturate, applied to the composited light layers.
export function beamColorMatrix(degrees: number, saturation: number, brightness = 1.3) {
  'worklet';
  const c = Math.cos(degrees * Math.PI / 180);
  const s = Math.sin(degrees * Math.PI / 180);
  const hue = [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
  ];
  const weights = [0.213, 0.715, 0.072];
  const matrix = Array(20).fill(0);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      for (let k = 0; k < 3; k++) {
        const sat = weights[k] * (1 - saturation) + (row === k ? saturation : 0);
        matrix[row * 5 + col] += sat * hue[k * 3 + col] * brightness;
      }
    }
  }
  matrix[18] = 1;
  return matrix;
}

type Rotation = { rotate: number }[] | SharedValue<{ rotate: number }[]>;
type BeamCompositionProps = {
  width: number;
  height: number;
  borderRadius: number;
  colorVariant: keyof typeof beamColors;
  theme: keyof typeof beamPresets;
  rotation: Rotation;
  colorMatrix: number[] | SharedValue<number[]>;
};

function LightField({ width, height, colorVariant, inner = false }: Pick<BeamCompositionProps, 'width' | 'height' | 'colorVariant'> & { inner?: boolean }) {
  return (
    <Group>
      {/* CSS backgrounds list the topmost layer first. Skia draws it last. */}
      {[...beamLights].reverse().map((light, reverseIndex) => {
        const index = beamLights.length - 1 - reverseIndex;
        const color = beamColors[colorVariant][index];
        const shrink = inner ? 0.9 : 1;
        return (
          <Group key={index} opacity={inner ? (colorVariant === 'mono' ? 0.225 : 0.45) : 1}
            transform={[{ translateX: width * light.x }, { translateY: height * light.y }, { scaleX: Math.round(light.rx * shrink) }, { scaleY: Math.round(light.ry * shrink) }]}>
            <Circle cx={0} cy={0} r={1}>
              <RadialGradient c={{ x: 0, y: 0 }} r={1} colors={[color, `${color}00`]} />
            </Circle>
          </Group>
        );
      })}
    </Group>
  );
}

function Sweep({ width, height, rotation, positions, alphas, ink = '255,255,255' }: Pick<BeamCompositionProps, 'width' | 'height' | 'rotation'> & { positions: number[]; alphas: number[]; ink?: string }) {
  const center = { x: width / 2, y: height / 2 };
  return (
    <Rect x={0} y={0} width={width} height={height}>
      <SweepGradient c={center} origin={center} transform={rotation} positions={positions}
        colors={alphas.map(alpha => `rgba(${ink},${alpha})`)} />
    </Rect>
  );
}

export function BeamComposition({ width, height, borderRadius, colorVariant, theme, rotation, colorMatrix }: BeamCompositionProps) {
  const radius = Math.min(borderRadius, width / 2, height / 2);
  const outer = { rect: { x: 0, y: 0, width, height }, rx: radius, ry: radius };
  const inner = { rect: { x: 1, y: 1, width: width - 2, height: height - 2 }, rx: Math.max(0, radius - 1), ry: Math.max(0, radius - 1) };
  const preset = beamPresets[theme];
  const mono = colorVariant === 'mono' ? 0.5 : 1;
  const ink = theme === 'dark' ? '255,255,255' : '0,0,0';
  const reveal = <Sweep width={width} height={height} rotation={rotation}
    positions={[0, 0.30, 0.36, 0.44, 0.52, 0.80, 0.86, 0.92, 0.95, 1]}
    alphas={[0, 0, 0.1, 0.35, 1, 1, 0.35, 0.1, 0, 0]} />;
  const field = { width, height, colorVariant };
  const edgeY = Math.min(28 / height, 0.5);
  const edgeX = Math.min(28 / width, 0.5);

  return (
    <Group clip={outer}>
      <Group layer={<Paint><ColorMatrix matrix={colorMatrix} /></Paint>}>
        {/* Inward light: rotating reveal intersected with a 28px edge-only mask. */}
        <Group layer={<Paint opacity={preset.inner * mono} />}>
          <LightField {...field} inner />
          <Box box={outer} color="transparent">
            <BoxShadow dx={0} dy={0} blur={9} spread={1} color={preset.shadow} inner />
          </Box>
          <Group layer={<Paint blendMode="dstIn" />}>
            <Rect x={0} y={0} width={width} height={height}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: height }} positions={[0, edgeY, 1 - edgeY, 1]} colors={['white', '#ffffff00', '#ffffff00', 'white']} />
            </Rect>
            <Rect x={0} y={0} width={width} height={height}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: width, y: 0 }} positions={[0, edgeX, 1 - edgeX, 1]} colors={['white', '#ffffff00', '#ffffff00', 'white']} />
            </Rect>
          </Group>
          <Group layer={<Paint blendMode="dstIn" />}>{reveal}</Group>
        </Group>
        {/* One-pixel border: same stationary colors and reveal, plus a soft moving sheen. */}
        <Group clip={inner} invertClip layer={<Paint opacity={preset.stroke * mono} />}>
          <LightField {...field} />
          <Sweep width={width} height={height} rotation={rotation} ink={ink}
            positions={[0, 0.54, 0.57, 0.60, 0.63, 0.66, 0.69, 0.72, 0.75, 0.78, 1]}
            alphas={theme === 'dark' ? [0, 0, 0.1, 0.3, 0.6, 0.75, 0.6, 0.3, 0.1, 0, 0] : [0, 0, 0.08, 0.2, 0.4, 0.55, 0.4, 0.2, 0.08, 0, 0]} />
          <Group layer={<Paint blendMode="dstIn" />}>{reveal}</Group>
        </Group>
        {/* Independent highlight: blur the ring first, then clip to the card. */}
        <Group layer={<Paint opacity={preset.bloom * mono}><Blur blur={8} /></Paint>}>
          <Group clip={inner} invertClip>
            <Sweep width={width} height={height} rotation={rotation} ink={ink}
              positions={[0, 0.58, 0.62, 0.65, 0.67, 0.69, 0.70, 0.705, 0.715, 0.73, 0.75, 0.78, 0.82, 1]}
              alphas={theme === 'dark' ? [0, 0, 0.03, 0.08, 0.2, 0.45, 0.85, 0.85, 0.45, 0.2, 0.08, 0.03, 0, 0] : [0, 0, 0.02, 0.08, 0.2, 0.4, 0.6, 0.6, 0.4, 0.2, 0.08, 0.02, 0, 0]} />
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
