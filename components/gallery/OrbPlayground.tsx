import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { OrbState } from '@/shared/effects/ThinkingOrb';
import { ThinkingOrb } from '@/shared/effects/ThinkingOrb';

const orbStates: OrbState[] = [
  'listening',
  'working',
  'solving',
  'breathing',
  'searching',
  'connecting',
  'weaving',
  'composing',
];

export function OrbPlayground({
  theme,
}: {
  theme: {
    accent: string;
    accentText: string;
    background: string;
    border: string;
    surfaceElevated: string;
    text: string;
    textMuted: string;
  };
}) {
  const [state, setState] = useState<OrbState>('working');
  const [size, setSize] = useState<64 | 20>(64);
  const [paused, setPaused] = useState(false);
  const orbButtons: { label: string; state: OrbState }[] = [
    { label: 'Solving...', state: 'solving' },
    { label: 'Thinking...', state: 'breathing' },
    { label: 'Agent listening...', state: 'listening' },
    { label: 'Working...', state: 'working' },
  ];

  return (
    <View style={styles.orbPlayground}>
      <View style={styles.orbStage}>
        <ThinkingOrb
          state={state}
          size={size}
          paused={paused}
          dark={theme.background === '#09090b'}
        />
      </View>

      <View style={styles.orbStateGrid}>
        {orbStates.map((orbState) => {
          const selected = state === orbState;
          return (
            <Pressable
              key={orbState}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setState(orbState)}
              style={[
                styles.orbStateButton,
                {
                  backgroundColor: selected ? theme.accent : theme.surfaceElevated,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.orbStateText,
                  { color: selected ? theme.accentText : theme.text },
                ]}
              >
                {orbState[0].toUpperCase() + orbState.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.orbToolbar}>
        <View style={[styles.orbSizeControl, { borderColor: theme.border }]}>
          {([64, 20] as const).map((orbSize) => {
            const selected = size === orbSize;
            return (
              <Pressable
                key={orbSize}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSize(orbSize)}
                style={[
                  styles.orbSizeButton,
                  selected && { backgroundColor: theme.surfaceElevated },
                ]}
              >
                <Text
                  style={[
                    styles.orbSizeText,
                    { color: selected ? theme.text : theme.textMuted },
                  ]}
                >
                  {orbSize}px
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          accessibilityLabel={paused ? 'Play orb animation' : 'Pause orb animation'}
          accessibilityRole="button"
          onPress={() => setPaused((current) => !current)}
          style={[
            styles.orbPlayButton,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
          ]}
        >
          <MaterialIcons
            name={paused ? 'play-arrow' : 'pause'}
            size={19}
            color={theme.text}
          />
        </Pressable>
      </View>

      <View style={styles.orbPillGrid}>
        {orbButtons.map((button) => {
          const selected = state === button.state && !paused;
          return (
            <Pressable
              key={button.state}
              accessibilityRole="button"
              accessibilityState={{ selected, busy: selected }}
              onPress={() => {
                setState(button.state);
                setPaused(false);
              }}
              style={[
                styles.orbPill,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <ThinkingOrb
                state={button.state}
                size={20}
                paused={!selected}
                dark={theme.background === '#09090b'}
              />
              <Text style={[styles.orbPillText, { color: theme.text }]}>
                {button.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orbPlayground: { gap: 14, width: '100%' },
  orbStage: { alignItems: 'center', height: 72, justifyContent: 'center' },
  orbStateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center' },
  orbStateButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 32,
    paddingHorizontal: 9,
    justifyContent: 'center',
  },
  orbStateText: { fontSize: 11, fontWeight: '700' },
  orbToolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  orbSizeControl: { borderRadius: 6, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
  orbSizeButton: { alignItems: 'center', height: 34, justifyContent: 'center', minWidth: 54, paddingHorizontal: 10 },
  orbSizeText: { fontSize: 12, fontWeight: '800' },
  orbPlayButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  orbPillGrid: { alignItems: 'center', gap: 10 },
  orbPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    width: '100%',
  },
  orbPillText: { flex: 1, fontSize: 16, fontWeight: '500' },
});
