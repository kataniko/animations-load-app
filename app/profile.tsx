import { ProfileStat } from '@/components/profile/ProfileStat';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { GlassCard } from '@/shared/glass/GlassCard';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.cover} />
          <GlassCard style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RN</Text>
            </View>
            <Text style={styles.name}>Motion Engineer</Text>
            <Text style={styles.handle}>@animations-load-app</Text>
            <Text style={styles.bio}>
              Mobile UI motion patterns built with React Native, Reanimated, and Skia.
            </Text>

            <View style={styles.statsRow}>
              <ProfileStat value="18" label="Prototypes" />
              <ProfileStat value="60" label="Target FPS" />
              <ProfileStat value="42" label="Shots" />
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  screen: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  cover: {
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    height: 138,
  },
  profileCard: {
    borderRadius: 22,
    marginTop: -32,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    borderColor: 'rgba(255, 247, 251, 0.24)',
    borderRadius: 35,
    borderWidth: 4,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  avatarText: {
    color: '#09090b',
    fontSize: 24,
    fontWeight: '900',
  },
  name: {
    color: '#fafafa',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 14,
  },
  handle: {
    color: '#a3a3a3',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  bio: {
    color: '#d4d4d8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  statsRow: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 16,
  },
});
