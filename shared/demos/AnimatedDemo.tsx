import { useEffect, useState } from 'react';
import { Animated, Easing, Switch, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';

export function AnimatedDemo() {
  const { theme } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState(600);
  const [end, setEnd] = useState(false);
  const [width, setWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => () => progress.stopAnimation(), [progress]);

  function play() {
    progress.stopAnimation();
    const next = !end;
    setEnd(next);
    Animated.timing(progress, {
      toValue: next ? 1 : 0,
      duration: enabled && !reducedMotion ? duration : 0,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  return (
    <>
      <View style={s.row}>
        <Switch accessibilityLabel="Enable motion" value={enabled} onValueChange={setEnabled} />
        <Text style={{ color: theme.text }}>{enabled ? 'With motion' : 'Without motion'}</Text>
      </View>
      <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[s.stage, { backgroundColor: theme.surfaceElevated }]}>
        <Animated.View style={[s.ball, { backgroundColor: theme.accent, transform: [
          { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [8, Math.max(8, width - 48)] }) },
          { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
        ], borderRadius: 12 }]} />
      </View>
      <View style={s.row}>
        {[200, 600, 1200].map(ms => <Action key={ms} label={`${ms} ms`} selected={duration === ms} onPress={() => setDuration(ms)} />)}
      </View>
      <Action label={end ? 'Reset' : 'Run transition'} selected onPress={play} />
      <Copy>{reducedMotion ? 'System Reduce Motion active: transition is instantaneous.' : 'Interruptible state transitions using the built-in Animated timing engine.'}</Copy>
    </>
  );
}
