import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80' }}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cover} />
          <View style={styles.profileCard}>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
  cover: {
    backgroundColor: 'rgba(240, 154, 214, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    height: 138,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: -32,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#f09ad6',
    borderColor: 'rgba(255, 247, 251, 0.24)',
    borderRadius: 35,
    borderWidth: 4,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  avatarText: {
    color: '#170d17',
    fontSize: 24,
    fontWeight: '900',
  },
  name: {
    color: '#fff7fb',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 14,
  },
  handle: {
    color: '#c8b7c9',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  bio: {
    color: '#f4eaf4',
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
    color: '#fff7fb',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#c8b7c9',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});