import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export function ElasticDrawerDemo({
  theme,
}: {
  theme: { accent: string; accentText: string; text: string; textMuted: string; surfaceElevated: string; border: string };
}) {
  const [open, setOpen] = useState(false);
  const translateY = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  function toggle() {
    const next = !open;
    setOpen(next);
    translateY.set(withSpring(next ? -48 : 0, { damping: 12, stiffness: 180 }));
  }

  return (
    <View style={styles.drawerWrapper}>
      <Pressable
        onPress={toggle}
        style={[styles.demoButton, { backgroundColor: theme.accent }]}
      >
        <MaterialIcons
          name={open ? 'expand-less' : 'expand-more'}
          size={20}
          color={theme.accentText}
        />
        <Text style={[styles.demoButtonText, { color: theme.accentText }]}>
          {open ? 'Close preview' : 'Peek content'}
        </Text>
      </Pressable>
      <Animated.View
        style={[
          styles.drawerPreview,
          { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
          style,
        ]}
      >
        <View style={[styles.drawerHandle, { backgroundColor: theme.textMuted }]} />
        <Text style={[styles.drawerText, { color: theme.text }]}>
          Spring Elastic Sheet revealed
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerWrapper: {
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    paddingBottom: 6,
    width: '100%',
  },
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
  drawerPreview: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    width: '92%',
  },
  drawerHandle: {
    backgroundColor: '#71717a',
    borderRadius: 3,
    height: 4,
    marginBottom: 8,
    width: 36,
  },
  drawerText: { fontSize: 13, fontWeight: '700' },
});
