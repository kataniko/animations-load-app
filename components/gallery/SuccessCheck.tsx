import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SuccessCheck({ color, textColor }: { color: string; textColor: string }) {
  const [success, setSuccess] = useState(false);
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function press() {
    setSuccess((current) => !current);
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(withSpring(1.3), withSpring(1));
  }

  return (
    <AnimatedPressable
      onPress={press}
      style={[
        styles.demoButton,
        { backgroundColor: success ? '#62c998' : color },
        style,
      ]}
    >
      <MaterialIcons
        name={success ? 'check' : 'done'}
        size={22}
        color={success ? '#10251b' : textColor}
      />
      <Text
        style={[
          styles.demoButtonText,
          { color: success ? '#10251b' : textColor },
        ]}
      >
        {success ? 'Completed' : 'Complete'}
      </Text>
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
