import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MagneticButton({ color, textColor }: { color: string; textColor: string }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.92);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSequence(withSpring(1.08), withSpring(1));
      }}
      style={[styles.demoButton, { backgroundColor: color }, style]}
    >
      <Text style={[styles.demoButtonText, { color: textColor }]}>Touch me</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  demoButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    minWidth: 150,
    paddingHorizontal: 20,
  },
  demoButtonText: { fontSize: 15, fontWeight: '900' },
});
