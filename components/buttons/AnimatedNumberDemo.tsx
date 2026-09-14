import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedNumberDemo({
  theme,
}: {
  theme: { text: string; textMuted: string; accent: string; accentText: string };
}) {
  const [number, setNumber] = useState(128);
  const value = useSharedValue(128);
  const animatedProps = useAnimatedProps(() => ({
    text: `${Math.round(value.value)}`,
  } as any));

  function changeBy(amount: number) {
    const next = Math.max(0, number + amount);
    setNumber(next);
    // eslint-disable-next-line react-hooks/immutability
    value.value = withTiming(next, { duration: 450 });
  }

  return (
    <View style={styles.numberDemo}>
      <AnimatedTextInput
        accessibilityLabel="Animated number"
        animatedProps={animatedProps}
        defaultValue="128"
        editable={false}
        style={[styles.number, { color: theme.text }]}
      />
      <View style={styles.numberControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease by 25"
          onPress={() => changeBy(-25)}
          style={[styles.numberButton, { borderColor: theme.accent }]}
        >
          <MaterialIcons name="remove" size={20} color={theme.accent} />
        </Pressable>
        <Text style={[styles.numberHint, { color: theme.textMuted }]}>withTiming</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase by 25"
          onPress={() => changeBy(25)}
          style={[styles.numberButton, { backgroundColor: theme.accent }]}
        >
          <MaterialIcons name="add" size={20} color={theme.accentText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  numberDemo: { alignItems: 'center' },
  number: { fontSize: 54, fontWeight: '900', padding: 0, textAlign: 'center', width: 180 },
  numberControls: { alignItems: 'center', flexDirection: 'row', gap: 14, marginTop: 10 },
  numberButton: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  numberHint: { fontSize: 12, fontWeight: '800' },
});
