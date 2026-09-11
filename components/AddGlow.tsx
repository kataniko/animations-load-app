import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const AnimatedRing = Animated.createAnimatedComponent(View);

export function AddGlow({ size = 42 }: { size?: number }) {
  const rotation = useSharedValue(0);
  const ringSize = size + 14;
  const coreOffset = (ringSize - size) / 2;

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 5200 }), -1, false);
  }, [rotation]);

  const ringStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View pointerEvents="none" style={{ height: ringSize, width: ringSize }}>
      <AnimatedRing style={[styles.ring, { height: ringSize, left: 0, top: 0, width: ringSize }, ringStyle]}>
        <Svg height={ringSize} width={ringSize} viewBox="0 0 66 66">
          <Defs>
            <LinearGradient id="add-gradient" x1="0" x2="1" y1="0" y2="1">
              <Stop offset="0" stopColor="#9B5CFF" />
              <Stop offset="0.5" stopColor="#55E7FF" />
              <Stop offset="1" stopColor="#5D4BFF" />
            </LinearGradient>
          </Defs>
          <Path d="M33 5C42 5 49 8 55 14C61 20 61 27 60 34C61 42 55 50 49 55C42 61 34 60 27 61C19 60 12 55 8 49C3 42 5 34 5 28C5 20 11 13 18 9C23 6 28 6 33 5Z" fill="none" opacity="0.3" stroke="url(#add-gradient)" strokeWidth="7" />
          <Path d="M33 5C42 5 49 8 55 14C61 20 61 27 60 34C61 42 55 50 49 55C42 61 34 60 27 61C19 60 12 55 8 49C3 42 5 34 5 28C5 20 11 13 18 9C23 6 28 6 33 5Z" fill="none" stroke="url(#add-gradient)" strokeWidth="2" />
        </Svg>
      </AnimatedRing>
      <View style={[styles.core, { borderRadius: size / 2, height: size, left: coreOffset, top: coreOffset, width: size }]}>
        <MaterialIcons name="add" size={24} color="#FAFAFA" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  core: { alignItems: 'center', backgroundColor: 'transparent', justifyContent: 'center', position: 'absolute' },
});
