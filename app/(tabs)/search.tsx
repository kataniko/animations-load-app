import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { GlassPressable } from '@/components/GlassPressable';

const trends = ['Reanimated 4', 'Swipe cards', 'Shared transition', 'Like burst', 'Onboarding reveal'];

export default function SearchScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#d0d0d0" />
            <TextInput
              placeholder="Pesquisar motion, posts ou creators"
              placeholderTextColor="#b9a7bc"
              style={styles.searchInput}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {trends.map((trend, index) => (
            <GlassPressable key={trend} style={styles.trendCard}>
              <Text style={styles.trendMeta}>Trending in animations · {index + 1}</Text>
              <Text style={styles.trendTitle}>#{trend.replaceAll(' ', '')}</Text>
              <Text style={styles.trendCount}>{(index + 2) * 11}.4K posts</Text>
            </GlassPressable>
          ))}
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
  header: {
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  title: {
    color: '#fafafa',
    fontSize: 30,
    fontWeight: '900',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: '#fafafa',
    flex: 1,
    fontSize: 15,
    minHeight: 46,
  },
  content: {
    gap: 12,
    padding: 18,
    paddingBottom: 30,
  },
  trendCard: {
    padding: 17,
  },
  trendMeta: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
  },
  trendTitle: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  trendCount: {
    color: '#d4d4d4',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
});