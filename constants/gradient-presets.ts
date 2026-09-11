export type GradientColors = readonly [string, ...string[]];

export type GradientPreset = keyof typeof GRADIENT_PRESETS;

export const AURAL_COLORS: GradientColors = ['#E4E4E7', '#A1A1AA', '#3B82F6', '#71717A'];

export const GRADIENT_PRESETS = {
  aural: {
    colors: AURAL_COLORS,
    accent: '#3B82F6',
  },
} as const;
