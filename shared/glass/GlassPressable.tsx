import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { GlassCard } from '@/shared/glass/GlassCard';

type GlassPressableProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GlassPressable({ children, onPress, style }: GlassPressableProps) {
  return (
    <GlassCard style={styles.card}>
      <Pressable accessibilityRole="button" onPress={onPress} style={style}>
        {children}
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
