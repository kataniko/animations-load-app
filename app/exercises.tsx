import { ExerciceResolution } from '@/components/exercises/ExerciceResolution';
import { ExerciceTraining } from '@/components/exercises/ExerciceTraining';
import { useAppTheme } from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExercisesScreen() {
  const { theme } = useAppTheme();
  const [activeStepTab, setActiveStepTab] = useState<'step1' | 'step2' | 'step3'>('step1');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <Text style={[styles.eyebrow, { color: theme.accent }]}>WORKSHOP</Text>
          <Text style={[styles.title, { color: theme.text }]}>Expandable Tab Bar</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Bottom navigation with fluid spring expansion and gestures.
          </Text>

          {/* Steps */}
          <View style={styles.stepsNav}>
            <Pressable
              onPress={() => setActiveStepTab('step1')}
              style={[
                styles.stepTab,
                {
                  backgroundColor: activeStepTab === 'step1' ? theme.accent : theme.surfaceElevated,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepTabText,
                  { color: activeStepTab === 'step1' ? theme.accentText : theme.text },
                ]}
              >
                1. Spring & Morph
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveStepTab('step2')}
              style={[
                styles.stepTab,
                {
                  backgroundColor: activeStepTab === 'step2' ? theme.accent : theme.surfaceElevated,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepTabText,
                  { color: activeStepTab === 'step2' ? theme.accentText : theme.text },
                ]}
              >
                2. Blur & Fade
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveStepTab('step3')}
              style={[
                styles.stepTab,
                {
                  backgroundColor: activeStepTab === 'step3' ? theme.accent : theme.surfaceElevated,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepTabText,
                  { color: activeStepTab === 'step3' ? theme.accentText : theme.text },
                ]}
              >
                3. Drag to Dismiss
              </Text>
            </Pressable>
          </View>

          {/* Guide card */}
          <View style={[styles.guideCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MaterialIcons name="info-outline" size={18} color={theme.accent} />
            <Text style={[styles.guideText, { color: theme.text }]}>
              {activeStepTab === 'step1' &&
                'Step 1: useSharedValue with withSpring to interpolate width, height, and morph the circular button into an expanded action bar.'}
              {activeStepTab === 'step2' &&
                'Step 2: BlurView with backdrop fade (interpolated opacity), switching between compact nav and panel content.'}
              {activeStepTab === 'step3' &&
                'Step 3: Gesture.Pan on drag handle to read translationY, move surface, and dismiss on threshold or flick.'}
            </Text>
          </View>

          {/* Target preview */}
          <View style={styles.sectionHeader}>
            <View style={styles.badgeRow}>
              <View style={[styles.badgeDot, { backgroundColor: '#22c55e' }]} />
              <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>TARGET PREVIEW</Text>
            </View>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Tap + or drag</Text>
          </View>

          <View style={[styles.stageCard, styles.previewCardShell, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ExerciceResolution />
          </View>

          {/* Divider */}
          <View style={styles.vsContainer}>
            <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
            <Text
              style={[
                styles.vsText,
                {
                  color: theme.textMuted,
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                },
              ]}
            >
              STUDENT WORK
            </Text>
            <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Student code */}
          <View style={styles.sectionHeader}>
            <View style={styles.badgeRow}>
              <View style={[styles.badgeDot, { backgroundColor: '#eab308' }]} />
              <Text style={[styles.sectionLabel, { color: '#eab308' }]}>YOUR WORKSPACE</Text>
            </View>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>components/exercises/ExerciceTraining.tsx</Text>
          </View>

          <View style={[styles.stageCard, styles.previewCardShell, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ExerciceTraining />

            <View style={[styles.instructionBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <MaterialIcons name="terminal" size={18} color={theme.accent} />

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 60,
    gap: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  back: { width: 44, height: 44, justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '900' },
  subtitle: { fontSize: 15, lineHeight: 22 },
  stepsNav: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  stepTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepTabText: {
    fontSize: 12,
    fontWeight: '800',
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  guideText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  sectionHint: { fontSize: 11, fontWeight: '600' },
  stageCard: {
    padding: 14,
    gap: 12,
  },
  previewCardShell: {
    borderRadius: 24,
    borderWidth: 1,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 12,
  },
  vsLine: { flex: 1, height: 1 },
  vsText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
