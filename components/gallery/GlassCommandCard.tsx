import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';

export function GlassCommandCard({
  theme,
}: {
  theme: { mode: 'light' | 'dark'; text: string; textMuted: string; accent: string; border: string; surfaceElevated: string };
}) {
  return (
    <View style={[styles.glassCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <BlurView intensity={35} tint={theme.mode} style={StyleSheet.absoluteFill} />
      <View style={[styles.glassOrb, { backgroundColor: theme.accent }]} />
      <MaterialIcons name="auto-awesome" size={22} color={theme.accent} />
      <View style={styles.glassCopy}>
        <Text style={[styles.glassTitle, { color: theme.text }]}>Ask anything</Text>
        <Text style={[styles.glassHint, { color: theme.textMuted }]}>
          Your next idea starts here
        </Text>
      </View>
      <MaterialIcons name="arrow-forward" size={20} color={theme.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    padding: 14,
    width: '100%',
  },
  glassOrb: {
    borderRadius: 30,
    height: 80,
    opacity: 0.18,
    position: 'absolute',
    right: -20,
    top: -28,
    width: 80,
  },
  glassCopy: { flex: 1 },
  glassTitle: { fontSize: 15, fontWeight: '900' },
  glassHint: { fontSize: 12, marginTop: 3 },
});
