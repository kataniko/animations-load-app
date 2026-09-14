import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Action } from '@/shared/showcase/Showcase';

export function TiltCardDemo({
  theme,
}: {
  theme: { accent: string; text: string; textMuted: string; surfaceElevated: string; border: string };
}) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
  }));

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-16, 16])
    .onStart(() => {
      scale.set(withSpring(1.05));
    })
    .onUpdate((event) => {
      rotateX.set(Math.max(-20, Math.min(20, -event.translationY / 6)));
      rotateY.set(Math.max(-20, Math.min(20, event.translationX / 6)));
    })
    .onFinalize(() => {
      rotateX.set(withSpring(0, { damping: 14, stiffness: 160 }));
      rotateY.set(withSpring(0, { damping: 14, stiffness: 160 }));
      scale.set(withSpring(1));
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.tiltCard,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            cardStyle,
          ]}
        >
          <View style={styles.tiltBadge}>
            <MaterialIcons name="touch-app" size={16} color={theme.accent} />
            <Text style={[styles.tiltBadgeText, { color: theme.accent }]}>
              Perspective · no gyroscope
            </Text>
          </View>
          <Text style={[styles.tiltTitle, { color: theme.text }]}>Interactive Depth</Text>
          <Text style={[styles.tiltDesc, { color: theme.textMuted }]}>
            Drag horizontally to tilt card
          </Text>
        </Animated.View>
      </GestureDetector>
      <Action
        label="Demo tilt"
        onPress={() =>
          rotateY.set(withSequence(withSpring(20), withSpring(-20), withSpring(0)))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 12, alignItems: 'center' },
  tiltCard: { borderRadius: 20, borderWidth: 1, padding: 20, width: '92%' },
  tiltBadge: { alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 8 },
  tiltBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  tiltTitle: { fontSize: 18, fontWeight: '900' },
  tiltDesc: { fontSize: 13, marginTop: 4 },
});
