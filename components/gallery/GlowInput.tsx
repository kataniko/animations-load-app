import { StyleSheet, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function GlowInput({
  theme,
}: {
  theme: { text: string; textMuted: string; accent: string; accentText: string; border: string; surfaceElevated: string };
}) {
  const focused = useSharedValue(0);
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + focused.value * 0.45,
  }));

  return (
    <View style={styles.glowInputWrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inputGlow,
          {
            boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 18, spreadDistance: 0, color: theme.accent }],
          },
          glowStyle,
        ]}
      />
      <View style={[styles.glowInput, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <MaterialIcons name="auto-awesome" size={19} color={theme.accent} />
        <TextInput
          accessibilityLabel="Describe your idea"
          placeholder="Describe your idea"
          placeholderTextColor={theme.textMuted}
          onFocus={() => {
            focused.value = withTiming(1, { duration: 220 });
          }}
          onBlur={() => {
            focused.value = withTiming(0, { duration: 220 });
          }}
          style={[styles.textInput, { color: theme.text }]}
        />
        <View style={[styles.sendButton, { backgroundColor: theme.accent }]}>
          <MaterialIcons name="north-east" size={17} color={theme.accentText} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glowInputWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 8,
    position: 'relative',
  },
  inputGlow: {
    borderRadius: 18,
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 8,
    right: 8,
  },
  glowInput: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 56,
    paddingHorizontal: 12,
    width: '100%',
    zIndex: 2,
  },
  textInput: { flex: 1, fontSize: 14, minHeight: 48 },
  sendButton: {
    alignItems: 'center',
    borderRadius: 13,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
});
