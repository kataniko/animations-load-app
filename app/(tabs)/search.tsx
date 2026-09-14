import { SearchTrendingTopic } from '@/components/search/SearchTrendingTopic';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { ThemedText } from '@/shared/themed/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const trending = ['Layout Animations', 'Shared Transitions', 'Fluid Gesture', 'Worklets'];

export default function SearchScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.heading}>
            Search
          </ThemedText>
          <ThemedText style={styles.subheading}>
            Find modules, animation techniques, and snippets.
          </ThemedText>
          <View style={styles.inputWrap}>
            <MaterialIcons name="search" size={22} color="#a1a1aa" />
            <TextInput
              placeholder="Search animations..."
              placeholderTextColor="#a1a1aa"
              style={styles.input}
            />
          </View>
          <Text style={styles.sectionTitle}>Trending topics</Text>
          <View style={styles.grid}>
            {trending.map((topic) => (
              <SearchTrendingTopic key={topic} topic={topic} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#09090b',
    flex: 1,
  },
  screen: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  heading: {
    color: '#fafafa',
    fontSize: 32,
    fontWeight: '900',
  },
  subheading: {
    color: '#a3a3a3',
    fontSize: 15,
    marginTop: 6,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    color: '#fafafa',
    flex: 1,
    fontSize: 15,
  },
  sectionTitle: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
