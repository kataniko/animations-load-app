import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { Action, Copy, Panel, ShowcaseScreen, showcaseStyles as s } from '@/shared/showcase/Showcase';
import { libraries, presentationSteps } from '@/constants/showcase';
import { useAppTheme } from '@/context/ThemeContext';

export default function PresentationScreen() {
  const [index, setIndex] = useState(0);
  const { theme } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const step = presentationSteps[index];
  const library = libraries.find(item => item.id === step.library)!;

  return (
    <ShowcaseScreen title="Interactive Motion Lab" eyebrow="Presenter Mode · 20 min">
      <Copy>A guided walkthrough of core mobile motion principles. Open a demo and return to continue.</Copy>
      <View accessible accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: presentationSteps.length, now: index + 1 }} style={s.row}>
        {presentationSteps.map((item, i) => <View key={item.title} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= index ? theme.accent : theme.border }} />)}
      </View>
      <Animated.View key={index} entering={reducedMotion ? undefined : FadeInDown.duration(220)} style={{ gap: 16 }}>
        <Text style={[s.eyebrow, { color: theme.accent }]}>{index + 1} / {presentationSteps.length} · {step.minutes}</Text>
        <Panel title={step.title}>
          <Text style={[s.copy, { color: theme.text }]}>“{step.say}”</Text>
          <Action label={`Open demo · ${library.title}`} selected onPress={() => router.push({ pathname: '/library/[id]', params: { id: step.library } })} />
        </Panel>
        <Panel title="Interactive task"><Copy>{step.action}</Copy></Panel>
      </Animated.View>
      <View style={s.row}>
        <Action label="Previous" disabled={index === 0} onPress={() => setIndex(current => Math.max(0, current - 1))} />
        <Action label={index === presentationSteps.length - 1 ? 'Restart' : 'Next chapter'} selected onPress={() => setIndex(current => (current + 1) % presentationSteps.length)} />
      </View>
      <Panel title="Jump to topic">
        {presentationSteps.map((item, i) => <Action key={item.title} label={`${i + 1}. ${item.title}`} selected={index === i} onPress={() => setIndex(i)} />)}
      </Panel>
      <Copy>Checklist before presenting: test build on device, turn off notifications, verify Reduce Motion setting.</Copy>
    </ShowcaseScreen>
  );
}
