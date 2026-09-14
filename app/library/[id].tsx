import { libraries } from '@/constants/showcase';
import { useAppTheme } from '@/context/ThemeContext';
import { AnimatedDemo } from '@/shared/demos/AnimatedDemo';
import { GestureDemo } from '@/shared/demos/GestureDemo';
import { LottieDemo } from '@/shared/demos/LottieDemo';
import { MaterialDemo } from '@/shared/demos/MaterialDemo';
import { SkiaDemo } from '@/shared/demos/SkiaDemo';
import { SpringDemo } from '@/shared/demos/SpringDemo';
import { Action, Copy, Panel, ShowcaseScreen, showcaseStyles as s } from '@/shared/showcase/Showcase';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const demos = { animated: AnimatedDemo, reanimated: SpringDemo, gestures: GestureDemo, skia: SkiaDemo, lottie: LottieDemo, materials: MaterialDemo };

export default function LibraryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const focused = useIsFocused();
  const library = libraries.find(item => item.id === id);

  if (!library) {
    return <ShowcaseScreen title="Library not found" eyebrow="Animation Lab"><Action label="Open catalog" onPress={() => router.replace('/(tabs)/explore')} /></ShowcaseScreen>;
  }

  const Demo = library.id === 'three' ? null : demos[library.id];

  return (
    <ShowcaseScreen title={library.title} eyebrow={`Chapter ${library.number} · Live lab`}>
      <Text style={[s.heading, { color: theme.text }]}>{library.tagline}</Text>
      <Copy>{library.description}</Copy>
      <Panel title="Live Playground">
        {focused && Demo ? <Demo /> : null}
        {library.id === 'three' ? <Action label="Open 3D Scene" selected onPress={() => router.push('/three')} /> : null}
      </Panel>
      <Panel title="When to use"><Copy>{library.use}</Copy></Panel>
      <Panel title="Code snippet">
        <Text selectable style={[s.code, { color: theme.text }]}>{library.code}</Text>
        <Copy>Source: {library.source}</Copy>
      </Panel>
      <Panel title="Important considerations"><Copy>{library.caution}</Copy></Panel>
      <View style={s.row}>
        {library.id === 'reanimated' ? <Action label="Button Motion" onPress={() => router.push('/buttons')} /> : null}
        {['reanimated', 'gestures', 'skia', 'materials'].includes(library.id) ? (
          <Action label="More gallery components" onPress={() => router.push({ pathname: '/gallery', params: { section: library.id } })} />
        ) : null}
        <Action label="Presentation walkthrough" onPress={() => router.push('/presentation')} />
      </View>
    </ShowcaseScreen>
  );
}
