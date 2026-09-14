import tw from '@/shared/tailwind';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SpringButton({ color, textColor }: { color: string; textColor: string }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSequence(withSpring(1.08), withSpring(1));
      }}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.94);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1);
      }}
      style={[tw`items-center justify-center min-h-[52px] rounded-[18px] px-5`, { backgroundColor: color }, animatedStyle]}
    >
      <Text style={[tw`text-[15px] font-black`, { color: textColor }]}>Press me</Text>
    </AnimatedPressable>
  );
}

