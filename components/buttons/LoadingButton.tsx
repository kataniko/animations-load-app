import tw from '@/shared/tailwind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function LoadingButton({ color, textColor }: { color: string; textColor: string }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const loading = status === 'saving';
  const rotation = useSharedValue(0);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    if (!loading) return;
    rotation.set(withRepeat(withTiming(360, { duration: 800 }), -1, false));
    const timer = setTimeout(() => setStatus('success'), 1500);
    return () => {
      clearTimeout(timer);
      cancelAnimation(rotation);
      rotation.set(0);
    };
  }, [loading, rotation]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={() => setStatus('saving')}
      style={[tw`items-center justify-center min-h-[52px] rounded-[18px] px-5`, { backgroundColor: color }]}
    >
      {loading ? (
        <View style={tw`items-center flex-row gap-2`}>
          <Animated.View style={spinnerStyle}>
            <MaterialIcons name="refresh" size={18} color={textColor} />
          </Animated.View>
          <Text style={[tw`text-[15px] font-black`, { color: textColor }]}>Saving…</Text>
        </View>
      ) : (
        <Text
          accessibilityLiveRegion="polite"
          style={[tw`text-[15px] font-black`, { color: textColor }]}
        >
          {status === 'success' ? '✓ Saved · try again' : 'Save changes'}
        </Text>
      )}
    </Pressable>
  );
}

