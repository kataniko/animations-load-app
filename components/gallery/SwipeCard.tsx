import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Action } from '@/shared/showcase/Showcase';

const screenWidth = Dimensions.get('window').width;

export function SwipeCard({
  theme,
}: {
  theme: { text: string; textMuted: string; accent: string };
}) {
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotate: `${x.value / 12}deg` }],
  }));

  const gesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-16, 16])
    .onUpdate((event) => {
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
    })
    .onFinalize((_event, success) => {
      if (!success) x.set(withSpring(0));
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeCard, { borderColor: theme.accent }, style]}>
          <MaterialIcons name="swipe" size={28} color={theme.accent} />
          <View>
            <Text style={[styles.swipeTitle, { color: theme.text }]}>Drag me</Text>
            <Text style={[styles.swipeHint, { color: theme.textMuted }]}>
              Release or swipe away
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
      <Action
        label="Simulate swipe →"
        onPress={() =>
          x.set(withSequence(withTiming(screenWidth, { duration: 220 }), withTiming(0, { duration: 0 })))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  swipeCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    minHeight: 72,
    paddingHorizontal: 22,
    width: '92%',
  },
  swipeTitle: { fontSize: 16, fontWeight: '900' },
  swipeHint: { fontSize: 12, marginTop: 3 },
});
