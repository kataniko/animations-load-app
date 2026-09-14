import type { libraries } from '@/constants/showcase';
import type { useAppTheme } from '@/context/ThemeContext';
import { showcaseStyles as s } from '@/shared/showcase/Showcase';
import tw from '@/shared/tailwind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type LibraryItem = (typeof libraries)[number];

export function LibraryCard({
  library,
  theme,
}: {
  library: LibraryItem;
  theme: ReturnType<typeof useAppTheme>['theme'];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${library.title}`}
      onPress={() =>
        router.push({ pathname: '/library/[id]', params: { id: library.id } })
      }
      style={({ pressed }) => [
        tw`flex-row items-center gap-3 p-4 rounded-[24px] border`,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <View style={[tw`w-12 h-12 rounded-2xl items-center justify-center`, { backgroundColor: theme.surfaceElevated }]}>
        <MaterialIcons name={library.icon} size={24} color={theme.accent} />
      </View>
      <View style={tw`flex-1 gap-1`}>
        <Text style={[s.eyebrow, { color: theme.textMuted }]}>
          CHAPTER {library.number}
        </Text>
        <Text style={[s.heading, { color: theme.text }]}>{library.title}</Text>
        <Text style={[s.copy, { color: theme.textMuted }]}>{library.tagline}</Text>
      </View>
      <MaterialIcons name="arrow-forward" size={20} color={theme.accent} />
    </Pressable>
  );
}

