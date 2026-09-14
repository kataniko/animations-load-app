import { useAppTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const COLLAPSED_WIDTH = 178;
const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 380;
const ACTION_SIZE = 42;

export function ExerciceTraining() {
  const { theme, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const panelWidth = stageWidth || width;

  /*
   * ================================================================
  * EXERCISE: rebuild the bottom navigation animation
   * ================================================================
   *
  * 1. Rise (Spring & Morph)
  *    - Use useSharedValue(0) for progress.
  *    - Animate width and height with withSpring.
  *    - Smoothly transform the + button into the continue button.
   *
   * 2. Blur & Fade
  *    - Add BlurView INSIDE the surface, not on the backdrop.
  *    - Use intensity={75}, a dark/light tint, and StyleSheet.absoluteFill.
  *    - Fade the compact bar and expanded content.
  *    - Rotate the + icon by 45 degrees.
   *
  * 3. Drag to close
  *    - Create dragY with useSharedValue(0).
  *    - Add Gesture.Pan() to dragHandleArea.
  *    - Apply translateY to the surface.
  *    - Close when dragged more than 90px or with high velocity.
   */


  return (
    <View
      onLayout={({ nativeEvent }) => setStageWidth(nativeEvent.layout.width)}
      style={[styles.stageBox, { backgroundColor: theme.surfaceElevated }]}
    >
      {/* Background elements make the BlurView visible. */}
      <View style={[styles.glow, styles.glowOne, { backgroundColor: theme.accent }]} />
      <View style={[styles.glow, styles.glowTwo, { backgroundColor: '#8b5cf6' }]} />
      <View style={[styles.previewCard, { backgroundColor: theme.surface, borderColor: theme.border }]} />

      {/* TODO: Turn this View into an Animated.View and apply the animated style. */}
      <View
        style={[
          styles.surface,
          {
            borderColor: theme.border,
            width: expanded ? panelWidth : COLLAPSED_WIDTH,
            height: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.35)' : 'rgba(255, 255, 255, 0.35)',
            },
          ]}
        />

        {expanded ? (
          <View style={styles.expandedContent}>
            {/* TODO: envolver com GestureDetector e usar este handle para o drag. */}
            <View style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.panelHeader}>
              <View style={{ width: 28 }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.panelTitle, { color: theme.text }]}>Create Motion</Text>
                <Text style={[styles.panelSubtitle, { color: theme.textMuted }]}>Reanimated · wizard</Text>
              </View>
              <Pressable hitSlop={12} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color={theme.textMuted} />
              </Pressable>
            </View>

            <Text style={[styles.stepLabel, { color: theme.textMuted }]}>Select animation</Text>
            <View style={styles.stepsBar}>
              <View style={[styles.stepSegment, { backgroundColor: theme.accent }]} />
              <View style={[styles.stepSegment, { backgroundColor: theme.border }]} />
              <View style={[styles.stepSegment, { backgroundColor: theme.border }]} />
            </View>

            <View style={styles.chipsGrid}>
              {['Feed reveal', 'Like burst', 'Story ring', '3D scene'].map((option, index) => (
                <View
                  key={option}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: index === 0 ? theme.accent : theme.surfaceElevated,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: index === 0 ? theme.accentText : theme.text }]}>
                    {option}
                  </Text>
                </View>
              ))}
            </View>
          </View >
        ) : (
          <View style={styles.compactNav}>
            <View style={styles.navButton}>
              <MaterialIcons name="home" size={20} color={theme.accent} />
            </View>
            <View style={{ width: ACTION_SIZE }} />
            <View style={styles.navButton}>
              <MaterialIcons name="auto-awesome-motion" size={20} color={theme.textMuted} />
            </View>
          </View>
        )
        }

        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded((current) => !current)}
          style={[styles.actionButtonHitbox]}
        >
          <View
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.accent,
                width: expanded ? panelWidth - 32 : ACTION_SIZE,
                height: expanded ? 48 : ACTION_SIZE,
                borderRadius: expanded ? 22 : ACTION_SIZE / 2,
              },
            ]}
          >
            {expanded ? (
              <View
                style={[styles.continueContent]}>
                <Text style={[styles.continueText, { color: theme.accentText }]}>Continue</Text>
                <MaterialIcons name="chevron-right" size={22} color={theme.accentText} />
              </View>
            ) : (
              <View>
                <MaterialIcons name="add" size={24} color={theme.accentText} />
              </View>
            )}
          </View>
        </Pressable>
      </View >
    </View >
  );
}

const styles = StyleSheet.create({
  stageBox: {
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  backdrop: { zIndex: 1 },
  glow: { position: 'absolute', width: 150, height: 150, borderRadius: 75, opacity: 0.3 },
  glowOne: { top: 42, left: 24 },
  glowTwo: { right: 18, top: 126 },
  previewCard: {
    position: 'absolute', width: 190, height: 120, borderRadius: 22,
    borderWidth: 1, opacity: 0.35, right: 26, top: 48,
    transform: [{ rotate: '8deg' }],
  },
  surface: {
    borderRadius: 24, borderWidth: 1, overflow: 'hidden', alignItems: 'center',
    justifyContent: 'flex-end', position: 'relative', zIndex: 2,
  },
  compactNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: COLLAPSED_HEIGHT,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingHorizontal: 10,
  },
  navButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  expandedContent: { position: 'absolute', top: 0, left: 0, right: 0, padding: 16, paddingBottom: 76 },
  dragHandleArea: { height: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  dragHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  panelTitle: { fontSize: 18, fontWeight: '900' },
  panelSubtitle: { fontSize: 12, fontWeight: '700' },
  closeBtn: { padding: 4 },
  stepLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  stepsBar: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  stepSegment: { flex: 1, height: 4, borderRadius: 2 },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '800' },
  actionButtonHitbox: { alignItems: 'center', height: 54, justifyContent: 'center', zIndex: 4 },
  actionButton: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  continueContent: { alignItems: 'center', flexDirection: 'row', gap: 6, justifyContent: 'center' },
  continueText: { fontSize: 14, fontWeight: '900' },
});
