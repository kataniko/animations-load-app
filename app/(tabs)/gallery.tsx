import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { BorderBeam, InnerBeamGlow } from '@/components/BorderBeam';
import type { OrbState } from '@/components/ThinkingOrb';
import { ThinkingOrb } from '@/components/ThinkingOrb';

import {
    useAnimatedThemeBackground,
    useAnimatedThemeBorder,
    useAnimatedThemeColor,
    useAppTheme,
} from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const screenWidth = 360;
const orbStates: OrbState[] = ['working', 'searching', 'solving', 'listening', 'connecting', 'weaving', 'composing', 'breathing', 'shaping'];

export default function GalleryScreen() {
  const { theme } = useAppTheme();
  const backgroundStyle = useAnimatedThemeBackground('#17191c', '#f5f5f5');
  const textStyle = useAnimatedThemeColor('#f5f5f5', '#17191c');
  const mutedStyle = useAnimatedThemeColor('#9da3a8', '#697078');
  const surfaceStyle = useAnimatedThemeBackground('#23262a', '#ffffff');
  const borderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.10)', 'rgba(23,25,28,0.12)');

  return (
    <Animated.View style={[styles.screen, { backgroundColor: theme.background }, backgroundStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MaterialIcons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.kicker, { color: theme.accent }]}>Animation gallery</Text>
          <Animated.Text style={[styles.title, { color: theme.text }, textStyle]}>Make it move.</Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: theme.textMuted }, mutedStyle]}>
            Quatro interações para explorar diferentes formas de motion mobile.
          </Animated.Text>
        </View>

        <Animated.ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <GalleryPanel title="Magnetic button" library="Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <MagneticButton color={theme.accent} textColor={theme.accentText} />
          </GalleryPanel>

          <GalleryPanel title="Swipe card" library="Gesture Handler + Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <SwipeCard theme={theme} />
          </GalleryPanel>

          <GalleryPanel title="Success check" library="Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <SuccessCheck color={theme.accent} textColor={theme.accentText} />
          </GalleryPanel>

          <GalleryPanel title="Liquid blob" library="Skia + Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <LiquidBlob color={theme.accent} secondaryColor="#f09ad6" />
          </GalleryPanel>

          <GalleryPanel title="Glass command card" library="BlurView + Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <GlassCommandCard theme={theme} />
          </GalleryPanel>

          <GalleryPanel title="Thinking orb" library="Skia + Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <OrbPlayground theme={theme} />
          </GalleryPanel>

          <GalleryPanel title="Beam input" library="Skia + Reanimated" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <BeamInput theme={theme} />
          </GalleryPanel>

          <GalleryPanel title="AI glow input" library="Reanimated + BlurView" theme={theme} surfaceStyle={surfaceStyle} borderStyle={borderStyle}>
            <GlowInput theme={theme} />
          </GalleryPanel>
        </Animated.ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function GalleryPanel({
  title,
  library,
  theme,
  surfaceStyle,
  borderStyle,
  children,
}: {
  title: string;
  library: string;
  theme: { text: string; surface: string; border: string; accent: string };
  surfaceStyle: object;
  borderStyle: object;
  children: ReactNode;
}) {
  return (
    <Animated.View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }, surfaceStyle, borderStyle]}>
      <Animated.Text style={[styles.panelTitle, { color: theme.text }]}>{title}</Animated.Text>
      <Animated.Text style={[styles.library, { color: theme.accent }]}>{library}</Animated.Text>
      <View style={styles.demoArea}>{children}</View>
    </Animated.View>
  );
}

function MagneticButton({ color, textColor }: { color: string; textColor: string }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        // Reanimated shared values are intentionally mutable.
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.92);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSequence(withSpring(1.08), withSpring(1));
      }}
      style={[styles.demoButton, { backgroundColor: color }, style]}>
      <Text style={[styles.demoButtonText, { color: textColor }]}>Touch me</Text>
    </AnimatedPressable>
  );
}

function SwipeCard({ theme }: { theme: { text: string; textMuted: string; accent: string } }) {
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotate: `${x.value / 12}deg` }],
  }));
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Reanimated shared values are intentionally mutable.
      // eslint-disable-next-line react-hooks/immutability
      x.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(x.value) > 110) {
        // eslint-disable-next-line react-hooks/immutability
        x.value = withTiming(x.value > 0 ? screenWidth : -screenWidth, { duration: 220 }, () => {
          x.value = 0;
        });
      } else {
        x.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.swipeCard, { borderColor: theme.accent }, style]}>
        <MaterialIcons name="swipe" size={28} color={theme.accent} />
        <View>
          <Text style={[styles.swipeTitle, { color: theme.text }]}>Drag me</Text>
          <Text style={[styles.swipeHint, { color: theme.textMuted }]}>Release or swipe away</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function SuccessCheck({ color, textColor }: { color: string; textColor: string }) {
  const [success, setSuccess] = useState(false);
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function press() {
    setSuccess((current) => !current);
    // Reanimated shared values are intentionally mutable.
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(withSpring(1.3), withSpring(1));
  }

  return (
    <AnimatedPressable onPress={press} style={[styles.demoButton, { backgroundColor: success ? '#62c998' : color }, style]}>
      <MaterialIcons name={success ? 'check' : 'done'} size={22} color={success ? '#10251b' : textColor} />
      <Text style={[styles.demoButtonText, { color: success ? '#10251b' : textColor }]}>{success ? 'Completed' : 'Complete'}</Text>
    </AnimatedPressable>
  );
}

function GlassCommandCard({ theme }: { theme: { text: string; textMuted: string; accent: string; border: string } }) {
  return (
    <View style={styles.glassCard}>
      <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.glassOrb, { backgroundColor: theme.accent }]} />
      <MaterialIcons name="auto-awesome" size={22} color={theme.accent} />
      <View style={styles.glassCopy}>
        <Text style={[styles.glassTitle, { color: theme.text }]}>Ask anything</Text>
        <Text style={[styles.glassHint, { color: theme.textMuted }]}>Your next idea starts here</Text>
      </View>
      <MaterialIcons name="arrow-forward" size={20} color={theme.textMuted} />
    </View>
  );
}

function OrbPlayground({
  theme,
}: {
  theme: { accent: string; accentText: string; background: string; border: string; surfaceElevated: string; text: string; textMuted: string };
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
        <ThinkingOrb state={state} size={size} paused={paused} dark={theme.background !== '#f5f5f5'} />
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
                { backgroundColor: selected ? theme.accent : theme.surfaceElevated, borderColor: selected ? theme.accent : theme.border },
              ]}
            >
              <Text style={[styles.orbStateText, { color: selected ? theme.accentText : theme.text }]}>
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
                style={[styles.orbSizeButton, selected && { backgroundColor: theme.surfaceElevated }]}
              >
                <Text style={[styles.orbSizeText, { color: selected ? theme.text : theme.textMuted }]}>{orbSize}px</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          accessibilityLabel={paused ? 'Play orb animation' : 'Pause orb animation'}
          accessibilityRole="button"
          onPress={() => setPaused((current) => !current)}
          style={[styles.orbPlayButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
        >
          <MaterialIcons name={paused ? 'play-arrow' : 'pause'} size={19} color={theme.text} />
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
              style={[styles.orbPill, { backgroundColor: theme.surfaceElevated, borderColor: selected ? theme.accent : theme.border }]}
            >
              <ThinkingOrb state={button.state} size={20} paused={!selected} dark={theme.background !== '#f5f5f5'} />
              <Text style={[styles.orbPillText, { color: theme.text }]}>{button.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BeamInput({ theme }: { theme: { text: string; textMuted: string; accent: string; border: string; surface: string } }) {
  return (
    <BorderBeam size="md" colorVariant="colorful" strength={0.7} borderRadius={18}>
      <View style={[styles.beamCard, { borderColor: theme.border }]}> 
        <InnerBeamGlow colorVariant="colorful" strength={0.7} borderRadius={16} />
        <View style={styles.mentionIcon}>
          <Text style={[styles.mentionText, { color: theme.textMuted }]}>@</Text>
        </View>
        <Text style={[styles.beamPlaceholder, { color: theme.textMuted }]}>Build anything...</Text>
        <View style={styles.beamControls}>
          <View style={styles.beamChip}><Text style={styles.beamChipText}>Agent⌄</Text></View>
          <View style={styles.beamChip}><Text style={styles.beamChipText}>Auto⌄</Text></View>
          <View style={[styles.beamSend, { backgroundColor: theme.surface }]}>
            <MaterialIcons name="arrow-upward" size={16} color={theme.textMuted} />
          </View>
        </View>
      </View>
    </BorderBeam>
  );
}

function GlowInput({ theme }: { theme: { text: string; textMuted: string; accent: string } }) {
  const focused = useSharedValue(0);
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + focused.value * 0.45,
    transform: [{ scale: 1 + focused.value * 0.04 }],
  }));

  return (
    <View style={styles.glowInputWrap}>
      <Animated.View pointerEvents="none" style={[styles.inputGlow, { backgroundColor: theme.accent }, glowStyle]} />
      <View style={styles.glowInput}>
        <MaterialIcons name="auto-awesome" size={19} color={theme.accent} />
        <TextInput
          placeholder="Describe your idea"
          placeholderTextColor={theme.textMuted}
          onFocus={() => { focused.value = withTiming(1, { duration: 220 }); }}
          onBlur={() => { focused.value = withTiming(0, { duration: 220 }); }}
          style={[styles.textInput, { color: theme.text }]}
        />
        <View style={[styles.sendButton, { backgroundColor: theme.accent }]}>
          <MaterialIcons name="north-east" size={17} color="#17191c" />
        </View>
      </View>
    </View>
  );
}

function LiquidBlob({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const radius = useSharedValue(52);
  const secondaryRadius = useSharedValue(32);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: radius.value / 52 }] }));

  return (
    <Pressable
      onPress={() => {
        radius.value = withSequence(withSpring(70), withSpring(52));
        secondaryRadius.value = withSequence(withSpring(44), withSpring(32));
      }}
      style={styles.blobPressable}>
      <Animated.View style={[styles.blob, style]}>
        <Canvas style={styles.canvas}>
          <Circle cx={72} cy={62} r={radius} color={color} />
          <Circle cx={120} cy={70} r={secondaryRadius} color={secondaryColor} opacity={0.82} />
        </Canvas>
      </Animated.View>
      <Text style={styles.blobHint}>Tap the blob</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: 20, paddingTop: 12 },
  backButton: { alignItems: 'center', borderRadius: 18, borderWidth: 1, height: 40, justifyContent: 'center', marginBottom: 22, width: 40 },
  kicker: { fontSize: 12, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 36, fontWeight: '900', marginTop: 6 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  content: { gap: 14, padding: 20, paddingTop: 0, paddingBottom: 130 },
  panel: { borderRadius: 22, borderWidth: 1, padding: 16 },
  panelTitle: { fontSize: 18, fontWeight: '900' },
  library: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  demoArea: { alignItems: 'center', minHeight: 92, justifyContent: 'center', marginTop: 16 },
  demoButton: { alignItems: 'center', borderRadius: 18, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 52, minWidth: 150, paddingHorizontal: 20 },
  demoButtonText: { fontSize: 15, fontWeight: '900' },
  swipeCard: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 14, justifyContent: 'center', minHeight: 72, paddingHorizontal: 22, width: '92%' },
  swipeTitle: { fontSize: 16, fontWeight: '900' },
  swipeHint: { fontSize: 12, marginTop: 3 },
  blobPressable: { alignItems: 'center', height: 112, justifyContent: 'center', width: '100%' },
  blob: { height: 112, width: 190 },
  canvas: { flex: 1 },
  blobHint: { color: '#9da3a8', fontSize: 11, fontWeight: '800', position: 'absolute', bottom: 2 },
  glassCard: { alignItems: 'center', borderColor: 'rgba(255,255,255,0.22)', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, overflow: 'hidden', padding: 14, width: '100%' },
  glassOrb: { borderRadius: 30, height: 80, opacity: 0.18, position: 'absolute', right: -20, top: -28, width: 80 },
  glassCopy: { flex: 1 },
  glassTitle: { fontSize: 15, fontWeight: '900' },
  glassHint: { fontSize: 12, marginTop: 3 },
  orbPlayground: { gap: 14, width: '100%' },
  orbStage: { alignItems: 'center', height: 72, justifyContent: 'center' },
  orbStateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center' },
  orbStateButton: { alignItems: 'center', borderRadius: 6, borderWidth: 1, minHeight: 32, paddingHorizontal: 9, justifyContent: 'center' },
  orbStateText: { fontSize: 11, fontWeight: '700' },
  orbToolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  orbSizeControl: { borderRadius: 6, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
  orbSizeButton: { alignItems: 'center', height: 34, justifyContent: 'center', minWidth: 54, paddingHorizontal: 10 },
  orbSizeText: { fontSize: 12, fontWeight: '800' },
  orbPlayButton: { alignItems: 'center', borderRadius: 6, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  orbPillGrid: { alignItems: 'center', gap: 10 },
  orbPill: { alignItems: 'center', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 10, minHeight: 54, paddingHorizontal: 16, width: '100%' },
  orbPillText: { flex: 1, fontSize: 16, fontWeight: '500' },
  beamCard: { backgroundColor: '#1d1d1d', borderRadius: 16, borderWidth: 1, height: 122, overflow: 'hidden', padding: 9, position: 'relative', width: '100%' },
  mentionIcon: { alignItems: 'center', backgroundColor: '#292929', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 13, borderWidth: 1, height: 26, justifyContent: 'center', width: 26 },
  mentionText: { fontSize: 16, fontWeight: '700' },
  beamPlaceholder: { fontSize: 13, marginTop: 13 },
  beamControls: { alignItems: 'center', bottom: 9, flexDirection: 'row', gap: 8, left: 9, position: 'absolute', right: 9 },
  beamChip: { backgroundColor: '#292929', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  beamChipText: { color: '#b0b0b0', fontSize: 12 },
  beamSend: { alignItems: 'center', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderWidth: 1, height: 28, justifyContent: 'center', marginLeft: 'auto', width: 28 },
  inputShell: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 10, minHeight: 56, overflow: 'hidden', paddingHorizontal: 15, width: '100%' },
  beam: { height: 2, left: 0, position: 'absolute', top: 0, width: 120 },
  textInput: { flex: 1, fontSize: 14, minHeight: 48 },
  glowInputWrap: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  inputGlow: { borderRadius: 24, height: 72, opacity: 0.25, position: 'absolute', width: '92%' },
  glowInput: { alignItems: 'center', backgroundColor: 'rgba(35,38,42,0.94)', borderColor: 'rgba(255,255,255,0.16)', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 9, minHeight: 56, paddingHorizontal: 12, width: '100%' },
  sendButton: { alignItems: 'center', borderRadius: 13, height: 34, justifyContent: 'center', width: 34 },
});
