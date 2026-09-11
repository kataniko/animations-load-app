import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cover} />
          <GlassCard style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>L</Text>
            </View>
            <Text style={styles.name}>Animation Showcase</Text>
            <Text style={styles.handle}>@motionlab</Text>
            <Text style={styles.bio}>
              Área de demonstração para explorar header collapse, métricas, tabs internas e entradas animadas.
            </Text>
            <View style={styles.statsRow}>
              <Stat value="128" label="Following" />
              <Stat value="9.8K" label="Followers" />
              <Stat value="42" label="Shots" />
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    color: '#dedede',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 18,
  },
  stat: {
    minWidth: 72,
  },
  statValue: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});