import { Canvas, Circle } from '@shopify/react-native-skia';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

export function LiquidBlob({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const radius = useSharedValue(52);
  const secondaryRadius = useSharedValue(32);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: radius.value / 52 }] }));

  return (
    <Pressable
      onPress={() => {
        radius.value = withSequence(withSpring(70), withSpring(52));
        secondaryRadius.value = withSequence(withSpring(44), withSpring(32));
      }}
      style={styles.blobPressable}
    >
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
  blobPressable: { alignItems: 'center', height: 112, justifyContent: 'center', width: '100%' },
  blob: { height: 112, width: 190 },
  canvas: { flex: 1 },
  blobHint: { color: '#a1a1aa', fontSize: 11, fontWeight: '800', position: 'absolute', bottom: 2 },
});
