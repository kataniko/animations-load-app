import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

export function GalleryPanel({
  visible,
  title,
  library,
  theme,
  surfaceStyle,
  borderStyle,
  children,
}: {
  visible: boolean;
  title: string;
  library: string;
  theme: { text: string; textMuted: string; surface: string; border: string; accent: string };
  surfaceStyle: object;
  borderStyle: object;
  children: ReactNode;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.panel, surfaceStyle, borderStyle]}>
      <Animated.Text style={[styles.panelTitle, { color: theme.text }]}>
        {title}
      </Animated.Text>
      <Animated.Text style={[styles.library, { color: theme.textMuted }]}>
        {library}
      </Animated.Text>
      <View style={styles.demoArea}>
        {Platform.OS === 'web' && library.includes('Skia') ? (
          <Text style={{ color: theme.text }}>Canvas demo available on iOS and Android builds.</Text>
        ) : (
          children
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 22, borderWidth: 1, padding: 16 },
  panelTitle: { fontSize: 18, fontWeight: '900' },
  library: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  demoArea: { alignItems: 'center', minHeight: 92, justifyContent: 'center', marginTop: 16 },
});
