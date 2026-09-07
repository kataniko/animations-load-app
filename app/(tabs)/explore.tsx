import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';

const experiments = [
  { name: 'Motion Orb 3D', detail: 'React Three Fiber · cena em tempo real', icon: 'view-in-ar', ready: true, href: '/(tabs)/three' as const },
  { name: 'Feed reveal', detail: 'Reanimated · entrada stagger', icon: 'vertical-align-bottom', ready: true },
  { name: 'Like burst', detail: 'Reanimated · spring + partículas', icon: 'favorite-border', ready: true },
  { name: 'Button Motion', detail: 'Reanimated · press, state e números', icon: 'touch-app', ready: true, href: '/(tabs)/buttons' as const },
  { name: 'Animation Gallery', detail: 'Reanimated · Gesture Handler · Skia', icon: 'auto-awesome', ready: true, href: '/(tabs)/gallery' as const },
];

export default function LabScreen() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.background, { backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>Animation lab</Text>
              <Text style={[styles.title, { color: theme.text }]}>Explora cada animação.</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/three')} style={styles.headerButton}>
              <MaterialIcons name="view-in-ar" size={24} color="#fff7fb" />
            </Pressable>
          </View>

          <View style={styles.previewPanel}>
            <View style={styles.phoneTop}>
              <View style={styles.cameraDot} />
            </View>
            <View style={styles.previewCardLarge}>
              <View style={styles.previewAvatar} />
              <View style={styles.previewLines}>
                <View style={[styles.previewLine, styles.previewLineLong]} />
                <View style={[styles.previewLine, styles.previewLineShort]} />
              </View>
            </View>
            <View style={styles.motionTrack}>
              <View style={styles.motionBlock} />
              <View style={[styles.motionBlock, styles.motionBlockMiddle]} />
              <View style={[styles.motionBlock, styles.motionBlockEnd]} />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Experiências</Text>
            <Text style={styles.sectionMeta}>6 demos</Text>
          </View>

          {experiments.map((item) => (
            <Pressable
              key={item.name}
              onPress={() => item.href && router.push(item.href as Href)}
              style={[styles.experimentRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.experimentIcon}>
                <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={22} color="#f09ad6" />
              </View>
              <View style={styles.experimentCopy}>
                <Text style={styles.experimentName}>{item.name}</Text>
                <Text style={styles.experimentDetail}>{item.detail}</Text>
              </View>
              <View style={[styles.statusBadge, item.ready && styles.statusBadgeReady]}>
                <Text style={[styles.statusText, item.ready && styles.statusTextReady]}>
                  {item.ready ? 'Ready' : 'Draft'}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0d0a12',
  },
  screen: {
    backgroundColor: 'rgba(8, 6, 12, 0.5)',
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  kicker: {
    color: '#f09ad6',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff7fb',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 8,
  },
  headerButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  previewPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 24,
    overflow: 'hidden',
    padding: 18,
  },
  phoneTop: {
    alignItems: 'center',
    height: 22,
  },
  cameraDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 4,
    height: 8,
    width: 48,
  },
  previewCardLarge: {
    backgroundColor: 'rgba(13, 10, 18, 0.74)',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  previewAvatar: {
    backgroundColor: '#f09ad6',
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  previewLines: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  previewLine: {
    backgroundColor: 'rgba(255, 247, 251, 0.32)',
    borderRadius: 5,
    height: 10,
  },
  previewLineLong: {
    width: '92%',
  },
  previewLineShort: {
    width: '58%',
  },
  motionTrack: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  motionBlock: {
    backgroundColor: 'rgba(240, 154, 214, 0.62)',
    borderRadius: 16,
    height: 72,
    flex: 1,
  },
  motionBlockMiddle: {
    backgroundColor: 'rgba(141, 162, 255, 0.58)',
    transform: [{ translateY: 12 }],
  },
  motionBlockEnd: {
    backgroundColor: 'rgba(246, 208, 136, 0.58)',
    transform: [{ translateY: 24 }],
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  sectionTitle: {
    color: '#fff7fb',
    fontSize: 19,
    fontWeight: '900',
  },
  sectionMeta: {
    color: '#c8b7c9',
    fontSize: 13,
    fontWeight: '800',
  },
  experimentRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 16,
  },
  experimentIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(240, 154, 214, 0.18)',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  experimentCopy: {
    flex: 1,
  },
  experimentName: {
    color: '#fff7fb',
    fontSize: 16,
    fontWeight: '900',
  },
  experimentDetail: {
    color: '#c8b7c9',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeReady: {
    backgroundColor: 'rgba(240, 154, 214, 0.24)',
  },
  statusText: {
    color: '#c8b7c9',
    fontSize: 12,
    fontWeight: '900',
  },
  statusTextReady: {
    color: '#f09ad6',
  },
});
