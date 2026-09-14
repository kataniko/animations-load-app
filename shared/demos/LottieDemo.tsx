import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';

const source = require('@/assets/animations/success.json');

export function LottieDemo() {
  const { theme } = useAppTheme();
  const animation = useRef<LottieView>(null);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  if (Platform.OS === 'web') return <Copy>Lottie native timeline is available in iOS and Android builds.</Copy>;

  function frame(progress: number) {
    setPlaying(false);
    animation.current?.pause();
    const target = Math.round(progress * (source.op - 1));
    animation.current?.play(target, target);
  }

  return (
    <>
      <View accessible accessibilityLabel="Vector checkmark timeline" style={[s.stage, { backgroundColor: theme.surfaceElevated }]}>
        <LottieView ref={animation} source={source} autoPlay={false} loop={false} speed={speed}
          onAnimationFinish={() => setPlaying(false)} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={s.row}>
        <Action label="Play" selected onPress={() => {
          if (reducedMotion) { frame(1); return; }
          animation.current?.play(0, source.op - 1);
          setPlaying(true);
        }} />
        <Action label="Pause" disabled={!playing} onPress={() => { animation.current?.pause(); setPlaying(false); }} />
        <Action label={speed === 1 ? '1× Speed' : '0.5× Speed'} onPress={() => setSpeed(speed === 1 ? 0.5 : 1)} />
      </View>
      <View style={s.row}>
        {[0, 0.5, 1].map(progress => <Action key={progress} label={`${progress * 100}%`} onPress={() => frame(progress)} />)}
      </View>
      <Copy>{reducedMotion ? 'Reduce Motion active: directly renders the final frame.' : 'Local vector asset · 90 frames @ 60 FPS · 1.5s runtime.'}</Copy>
    </>
  );
}
