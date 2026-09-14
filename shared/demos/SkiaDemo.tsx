import { Blur, Canvas, Circle, ColorMatrix, Group, Paint } from '@shopify/react-native-skia';
import { useState } from 'react';
import { Platform, Switch, Text, View } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { Action, Copy, showcaseStyles as s } from '@/shared/showcase/Showcase';

// Amplifica alpha depois do blur para unir as duas formas (metaballs).
const threshold = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 18, -7];

export function SkiaDemo() {
  const { theme } = useAppTheme();
  const [fused, setFused] = useState(true);
  const [near, setNear] = useState(false);
  const [width, setWidth] = useState(0);
  const distance = useSharedValue(65);
  if (Platform.OS === 'web') return <Copy>Open this demo on iOS or Android. Native canvas shaders are not loaded in web preview.</Copy>;

  return (
    <>
      <View style={s.row}>
        <Switch accessibilityLabel="Liquid fusion" value={fused} onValueChange={setFused} />
        <Text style={{ color: theme.text }}>Fusion {fused ? 'enabled' : 'disabled'}</Text>
      </View>
      <View accessible accessibilityLabel={near ? 'Two close circles' : 'Two separate circles'} onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[s.stage, { backgroundColor: theme.surfaceElevated }]}>
        <Canvas style={{ flex: 1 }}>
          <Group transform={[{ translateX: width / 2 - 45 }]} layer={fused ? <Paint><Blur blur={12} /><ColorMatrix matrix={threshold} /></Paint> : undefined}>
            <Circle cx={0} cy={100} r={40} color={theme.accent} />
            <Group transform={[{ translateX: 45 }]}>
              <Circle cx={distance} cy={100} r={34} color={theme.accent} />
            </Group>
          </Group>
        </Canvas>
      </View>
      <Action label={near ? 'Separate circles' : 'Merge circles'} selected onPress={() => {
        setNear(!near);
        distance.set(withSpring(near ? 65 : 10, { damping: 14, stiffness: 100 }));
      }} />
      <Copy>Geometry → blur → alpha threshold. Metaball blending computed entirely on the GPU canvas.</Copy>
    </>
  );
}
