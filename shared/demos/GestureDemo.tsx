import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';

export function GestureDemo() {
  const { theme } = useAppTheme();
  const [width, setWidth] = useState(0);
  const x = useSharedValue(0);
  const origin = useSharedValue(0);
  const pressed = useSharedValue(0);
  const limit = Math.max(0, width - 96);
  const style = useAnimatedStyle(() => ({ transform: [
    { translateX: x.value }, { scale: 1 + pressed.value * 0.06 },
    { rotate: `${pressed.value * 4}deg` },
  ] }));
  const gesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-16, 16])
    .onStart(() => { origin.set(x.get()); pressed.set(withSpring(1)); })
    .onUpdate(event => { x.set(Math.max(0, Math.min(limit, origin.get() + event.translationX))); })
    .onFinalize(() => {
      x.set(withSpring(x.get() > limit / 2 ? limit : 0, { damping: 16 }));
      pressed.set(withSpring(0));
    });

  return (
    <>
      <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[s.stage, { paddingHorizontal: 8, backgroundColor: theme.surfaceElevated }]}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
          <View style={{ flex: 1, borderRightWidth: 1, borderColor: theme.border }} />
          <View style={{ flex: 1, backgroundColor: theme.accent, opacity: 0.12 }} />
        </View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, { backgroundColor: theme.accent }, style]}>
            <Text style={{ color: theme.accentText, fontWeight: '800' }}>DRAG ↔</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={s.row}>
        <Action label="← Reset" onPress={() => x.set(withSpring(0))} />
        <Action label="Snap right →" onPress={() => x.set(withSpring(limit))} />
      </View>
      <Copy>Drag horizontally and release. Crossing the midpoint triggers the snap state. Buttons provide accessible alternatives.</Copy>
    </>
  );
}
const styles = StyleSheet.create({ card: { width: 80, height: 96, borderRadius: 20, alignItems: 'center', justifyContent: 'center' } });
