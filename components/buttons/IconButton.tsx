import tw from '@/shared/tailwind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({ color, textColor }: { color: string; textColor: string }) {
  const [active, setActive] = useState(false);
  const scale = useSharedValue(1);
  const burst = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const burstCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.4, 1.8]) }],
    opacity: interpolate(burst.value, [0, 0.5, 1], [0.8, 0.6, 0]),
  }));

  function press() {
    const next = !active;
    setActive(next);
    scale.set(
      withSequence(
        withSpring(1.35, { damping: 4, stiffness: 300 }),
        withSpring(1),
      ),
    );
    if (next) {
      burst.set(0);
      burst.set(withTiming(1, { duration: 400 }));
    }
  }

  return (
    <View style={tw`items-center justify-center relative`}>
      <Animated.View
        pointerEvents="none"
        style={[
          tw`absolute w-[52px] h-[52px] rounded-full border-2`,
          { borderColor: '#ef4444' },
          burstCircleStyle,
        ]}
      />
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={active ? 'Remove favorite' : 'Add favorite'}
        accessibilityState={{ selected: active }}
        onPress={press}
        style={[
          tw`items-center justify-center w-[52px] h-[52px] rounded-[18px]`,
          { backgroundColor: active ? '#ef4444' : color },
          iconStyle,
        ]}
      >
        <MaterialIcons
          name={active ? 'favorite' : 'favorite-border'}
          size={24}
          color={active ? '#ffffff' : textColor}
        />
      </AnimatedPressable>
    </View>
  );
}

