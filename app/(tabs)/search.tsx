import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const trends = ['Reanimated 4', 'Swipe cards', 'Shared transition', 'Like burst', 'Onboarding reveal'];

export default function SearchScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80' }}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#d9c9da" />
            <TextInput
              placeholder="Pesquisar motion, posts ou creators"
              placeholderTextColor="#b9a7bc"
              style={styles.searchInput}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {trends.map((trend, index) => (
            <Pressable key={trend} style={styles.trendCard}>
              <Text style={styles.trendMeta}>Trending in animations · {index + 1}</Text>
              <Text style={styles.trendTitle}>#{trend.replaceAll(' ', '')}</Text>
              <Text style={styles.trendCount}>{(index + 2) * 11}.4K posts</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
  header: {
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  title: {
    color: '#fff7fb',
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
    color: '#fff7fb',
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
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 18,
    borderWidth: 1,
    padding: 17,
  },
  trendMeta: {
    color: '#c8b7c9',
    fontSize: 12,
    fontWeight: '700',
  },
  trendTitle: {
    color: '#fff7fb',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  trendCount: {
    color: '#f09ad6',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
});