import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GlassRefractionButtonProps = {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GlassRefractionButton({ children, onPress, style }: GlassRefractionButtonProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        // Reanimated shared values are intentionally mutable.
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        // Reanimated shared values are intentionally mutable.
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1);
      }}
      style={[styles.button, style, pressStyle]}>
      {Platform.OS === 'ios' && isLiquidGlassAvailable() ? (
        <GlassView
          colorScheme="dark"
          glassEffectStyle="regular"
          isInteractive
          style={StyleSheet.absoluteFill}
          tintColor="rgba(59, 130, 246, 0.16)"
        />
      ) : (
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'rgba(59,130,246,0.12)', 'rgba(255,255,255,0.04)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.highlight} />
      <View style={styles.content}>{children}</View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: 'rgba(147, 197, 253, 0.5)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
    overflow: 'hidden',
    paddingHorizontal: 18,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    zIndex: 1,
  },
  highlight: {
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: 18,
    borderTopWidth: 1,
    left: 10,
    position: 'absolute',
    right: 10,
    top: 1,
  },
});
