import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BorderBeam } from '@/shared/effects/BorderBeam';

export function BeamInput({
  theme,
}: {
  theme: { mode: 'light' | 'dark'; text: string; textMuted: string; border: string; surface: string; surfaceElevated: string };
}) {
  // The reference uses a neutral charcoal canvas, not the catalog's blue surface.
  const cardBg = theme.mode === 'dark' ? '#202020' : theme.surface;
  const controlBg = theme.mode === 'dark' ? '#2b2b2b' : theme.surfaceElevated;
  const borderColor = theme.mode === 'dark' ? '#353535' : theme.border;
  return (
    <BorderBeam size="md" colorVariant="colorful" strength={0.7} theme={theme.mode} borderRadius={20}>
      <View style={[styles.beamCard, { backgroundColor: cardBg, borderColor }]}>
        <View style={[styles.mentionIcon, { backgroundColor: controlBg, borderColor }]}>
          <Text style={[styles.mentionText, { color: theme.textMuted }]}>@</Text>
        </View>
        <Text style={[styles.beamPlaceholder, { color: theme.textMuted }]}>Build anything...</Text>
        <View style={styles.beamControls}>
          <View style={[styles.beamChip, { backgroundColor: controlBg, borderColor }]}>
            <Text style={[styles.beamChipText, { color: theme.text }]}>Agent</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={theme.textMuted} />
          </View>
          <View style={[styles.beamChip, { backgroundColor: controlBg, borderColor }]}>
            <Text style={[styles.beamChipText, { color: theme.text }]}>Auto</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={theme.textMuted} />
          </View>
          <View style={[styles.beamSend, { backgroundColor: controlBg, borderColor }]}>
            <MaterialIcons name="arrow-upward" size={16} color={theme.textMuted} />
          </View>
        </View>
      </View>
    </BorderBeam>
  );
}

const styles = StyleSheet.create({
  beamCard: {
    borderRadius: 20,
    borderWidth: 1,
    height: 122,
    overflow: 'hidden',
    padding: 9,
    position: 'relative',
    width: '100%',
  },
  mentionIcon: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  mentionText: { fontSize: 16, fontWeight: '700' },
  beamPlaceholder: { fontSize: 13, marginTop: 13 },
  beamControls: {
    alignItems: 'center',
    bottom: 9,
    flexDirection: 'row',
    gap: 8,
    left: 9,
    position: 'absolute',
    right: 9,
  },
  beamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  beamChipText: { fontSize: 12 },
  beamSend: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    marginLeft: 'auto',
    width: 28,
  },
});
