import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { GradientColors, GradientPreset, GRADIENT_PRESETS } from '@/constants/gradient-presets';

type AnimatedGradientTextProps = {
  children: string;
  colors?: GradientColors;
  duration?: number;
  numberOfLines?: number;
  preset?: GradientPreset;
  style: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AnimatedGradientText({
  children,
  colors,
  duration = 2600,
  numberOfLines,
  preset = 'aural',
  style,
  containerStyle,
}: AnimatedGradientTextProps) {
  const [width, setWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));
  const presetColors = colors ?? GRADIENT_PRESETS[preset].colors;
  const repeatedColors = [...presetColors, ...presetColors, ...presetColors];

  useEffect(() => {
    if (!width) return;

    progress.setValue(0);
    const animation = Animated.loop(
      Animated.timing(progress, {
        duration: duration * 2,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [duration, progress, width]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, 0],
  });

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <MaskedView
      maskElement={<Text numberOfLines={numberOfLines} style={style}>{children}</Text>}
      style={containerStyle}>
      <View onLayout={handleLayout}>
        <Text numberOfLines={numberOfLines} style={[style, styles.hiddenText]}>{children}</Text>
        <Animated.View pointerEvents="none" style={[styles.gradientTrack, { transform: [{ translateX }], width: width * 3 }]}>
          <LinearGradient colors={repeatedColors as [string, string, ...string[]]} end={{ x: 1, y: 0.75 }} start={{ x: 0, y: 0.25 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  gradientTrack: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  hiddenText: {
    opacity: 0,
  },
});
