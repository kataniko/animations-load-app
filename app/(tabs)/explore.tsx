import { LibraryCard } from '@/components/explore/LibraryCard';
import { libraries } from '@/constants/showcase';
import { useAppTheme } from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LabScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={[s.screen, { backgroundColor: theme.background }]}>
      <AnimatedGradientBackground />
      <SafeAreaView style={s.screen}>
        <ScrollView
          contentContainerStyle={[s.content, styles.content]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[s.eyebrow, { color: theme.accent }]}>Animation Lab</Text>
          <Text accessibilityRole="header" style={[s.title, { color: theme.text }]}>
            Libraries & Demos
          </Text>
          <Copy>
            Interactive components organized by animation technology. Each module includes source code and architecture notes.
          </Copy>
          <Action
            label="▶ Start presentation"
            selected
            onPress={() => router.push('/presentation')}
          />
          <Text accessibilityRole="header" style={[s.heading, { color: theme.text }]}>
            Libraries ({libraries.length})
          </Text>
          {libraries.map((library) => (
            <LibraryCard key={library.id} library={library} theme={theme} />
          ))}
          <Text accessibilityRole="header" style={[s.heading, { color: theme.text }]}>
            Component Catalog
          </Text>
          <Copy>Original standalone playgrounds grouped by topic.</Copy>
          <Action
            label="Buttons & Numbers"
            onPress={() => router.push('/(tabs)/buttons')}
          />
          <Action
            label="Gallery & Gestures"
            onPress={() => router.push('/(tabs)/gallery')}
          />
          <Action
            label="Three.js 3D Scene"
            onPress={() => router.push('/(tabs)/three')}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 130 },
});
