import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const slides = [
  {
    title: 'Motion em primeiro plano',
    text: 'Uma experiência de onboarding onde cada gesto revela uma nova camada da interface.',
    icon: 'auto-awesome-motion' as const,
    color: '#f09ad6',
  },
  {
    title: 'Profundidade em cada gesto',
    text: 'Cards que inclinam, escalam e se movem com o dedo para criar uma transição mais natural.',
    icon: '3d-rotation' as const,
    color: '#8da2ff',
  },
  {
    title: 'Explora o showcase',
    text: 'Experimenta botões, gestos, números e uma cena 3D num único espaço interativo.',
    icon: 'play-circle-outline' as const,
    color: '#f6d088',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const page = useSharedValue(0);
  const gestureStart = useSharedValue(0);
  const glowRadius = useDerivedValue(() => 72 + page.value * 18);
  const lastIndex = slides.length - 1;

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -page.value * width }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      page.value,
      [0, 1, 2],
      slides.map((slide) => slide.color),
      'HSV',
    ),
    opacity: 0.16,
    transform: [{ scale: 1 + page.value * 0.06 }],
  }));

  const pan = Gesture.Pan()
    .onBegin(() => {
      gestureStart.value = page.value;
    })
    .onUpdate((event) => {
      // Reanimated shared values are intentionally mutable.
      // eslint-disable-next-line react-hooks/immutability
      page.value = Math.min(lastIndex, Math.max(0, gestureStart.value - event.translationX / width));
    })
    .onEnd((event) => {
      const projected = page.value + (event.velocityX < 0 ? 0.18 : event.velocityX > 0 ? -0.18 : 0);
      const next = Math.min(lastIndex, Math.max(0, Math.round(projected)));
      // eslint-disable-next-line react-hooks/immutability
      page.value = withSpring(next, { damping: 18, stiffness: 170, mass: 0.8 });
      runOnJS(setActiveIndex)(next);
    });

  function goHome() {
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <MaterialIcons name="auto-awesome-motion" size={22} color="#171219" />
          </View>
          <Pressable accessibilityRole="button" onPress={goHome} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.glowArea}>
          <Animated.View style={[styles.bottomGlow, glowStyle]} />
          <Canvas style={styles.skiaGlow}>
            <Circle cx={width / 2} cy={94} r={glowRadius} color={slides[activeIndex].color} opacity={0.26} />
            <Circle cx={width / 2 + 34} cy={116} r={28} color="#ffffff" opacity={0.12} />
          </Canvas>

          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.track, { width: width * slides.length }, trackStyle]}>
              {slides.map((slide, index) => (
                <SlideCard
                  key={slide.title}
                  slide={slide}
                  index={index}
                  page={page}
                  width={width}
                  isLast={index === lastIndex}
                  onFinish={goHome}
                />
              ))}
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((slide, index) => (
              <PaginationDot key={slide.title} index={index} page={page} color={slide.color} />
            ))}
          </View>
          <Text style={styles.swipeHint}>Swipe to explore</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SlideCard({
  slide,
  index,
  page,
  width,
  isLast,
  onFinish,
}: {
  slide: (typeof slides)[number];
  index: number;
  page: SharedValue<number>;
  width: number;
  isLast: boolean;
  onFinish: () => void;
}) {
  const cardStyle = useAnimatedStyle(() => {
    const distance = page.value - index;
    return {
      opacity: interpolate(Math.abs(distance), [0, 1], [1, 0.35]),
      transform: [
        { perspective: 900 },
        { rotate: `${interpolate(distance, [-1, 0, 1], [-7, 0, 7])}deg` },
        { scale: interpolate(Math.abs(distance), [0, 1], [1, 0.88]) },
        { translateY: interpolate(Math.abs(distance), [0, 1], [0, 18]) },
      ],
    };
  });
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: isLast ? interpolate(page.value, [slides.length - 1.45, slides.length - 1], [0, 1]) : 0,
    transform: [{ translateY: isLast ? interpolate(page.value, [slides.length - 1.45, slides.length - 1], [16, 0]) : 16 }],
  }));

  return (
    <Animated.View style={[styles.slide, { width }, cardStyle]}>
      <View style={[styles.slideIcon, { backgroundColor: slide.color }]}>
        <MaterialIcons name={slide.icon} size={30} color="#171219" />
      </View>
      <Text style={styles.slideEyebrow}>REACT NATIVE ANIMATION</Text>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.text}>{slide.text}</Text>
      <View style={styles.cardPreview}>
        <View style={styles.previewTop} />
        <View style={[styles.previewOrb, { backgroundColor: slide.color }]} />
        <View style={styles.previewLineLong} />
        <View style={styles.previewLineShort} />
      </View>
      {isLast && (
        <AnimatedPressable onPress={onFinish} style={[styles.startButton, { backgroundColor: slide.color }, buttonStyle]}>
          <Text style={styles.startButtonText}>Start exploring</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#171219" />
        </AnimatedPressable>
      )}
    </Animated.View>
  );
}

function PaginationDot({ index, page, color }: { index: number; page: SharedValue<number>; color: string }) {
  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(page.value, [index - 1, index, index + 1], ['#4b454d', color, '#4b454d'], 'HSV'),
    opacity: interpolate(page.value, [index - 1, index, index + 1], [0.45, 1, 0.45]),
    transform: [{ scaleX: interpolate(page.value, [index - 1, index, index + 1], [1, 2.6, 1]) }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#17191c', flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  brandMark: { alignItems: 'center', backgroundColor: '#f09ad6', borderRadius: 17, height: 42, justifyContent: 'center', width: 42 },
  skipButton: { borderColor: 'rgba(255,255,255,0.14)', borderRadius: 18, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 8 },
  skipText: { color: '#f5f5f5', fontSize: 13, fontWeight: '800' },
  glowArea: { flex: 1, justifyContent: 'center', overflow: 'hidden' },
  bottomGlow: { borderRadius: 180, height: 360, left: '50%', marginLeft: -180, position: 'absolute', top: '50%', width: 360 },
  skiaGlow: { height: 190, position: 'absolute', top: '50%', width: '100%' },
  track: { alignItems: 'center', flexDirection: 'row' },
  slide: { alignItems: 'center', paddingHorizontal: 34 },
  slideIcon: { alignItems: 'center', borderRadius: 28, height: 58, justifyContent: 'center', marginBottom: 20, width: 58 },
  slideEyebrow: { color: '#f6d088', fontSize: 11, fontWeight: '900', letterSpacing: 1.3, textAlign: 'center' },
  title: { color: '#f5f5f5', fontSize: 34, fontWeight: '900', lineHeight: 38, marginTop: 9, textAlign: 'center' },
  text: { color: '#9da3a8', fontSize: 15, lineHeight: 22, marginTop: 14, maxWidth: 330, textAlign: 'center' },
  cardPreview: { backgroundColor: '#23262a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, borderWidth: 1, height: 150, marginTop: 28, overflow: 'hidden', padding: 18, width: '100%' },
  previewTop: { alignSelf: 'center', backgroundColor: '#697078', borderRadius: 3, height: 6, width: 48 },
  previewOrb: { borderRadius: 38, height: 76, marginTop: 18, opacity: 0.8, width: 76 },
  previewLineLong: { backgroundColor: '#f5f5f5', borderRadius: 4, height: 8, marginTop: 12, width: '70%' },
  previewLineShort: { backgroundColor: '#697078', borderRadius: 4, height: 8, marginTop: 8, width: '44%' },
  startButton: { alignItems: 'center', borderRadius: 18, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 24, paddingHorizontal: 20, paddingVertical: 14 },
  startButtonText: { color: '#171219', fontSize: 15, fontWeight: '900' },
  footer: { alignItems: 'center', gap: 14, padding: 24 },
  pagination: { alignItems: 'center', flexDirection: 'row', gap: 10, height: 12 },
  dot: { borderRadius: 4, height: 8, width: 12 },
  swipeHint: { color: '#697078', fontSize: 12, fontWeight: '800' },
});
