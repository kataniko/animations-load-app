import { MotionScene } from '@/components/three/MotionScene';
import { appColors } from '@/constants/AppColors';
import { useAppTheme } from '@/context/ThemeContext';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Canvas } from '@react-three/fiber/native';
import { router, useIsFocused } from 'expo-router';
import { Suspense, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThreeScreen() {
  const [isTurbo, setIsTurbo] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [zoom, setZoom] = useState(4.4);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const focused = useIsFocused();
  const { theme } = useAppTheme();

  // Gesture tracking refs
  const initialPinchDistance = useRef<number | null>(null);
  const initialZoom = useRef<number>(4.4);
  const zoomRef = useRef<number>(4.4);
  const lastTouch = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 1) {
          lastTouch.current = { x: touches[0].pageX, y: touches[0].pageY };
        } else if (touches.length >= 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          initialPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
          initialZoom.current = zoomRef.current;
        }
      },
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 1) {
          // One finger: rotate
          const dx = touches[0].pageX - lastTouch.current.x;
          const dy = touches[0].pageY - lastTouch.current.y;
          lastTouch.current = { x: touches[0].pageX, y: touches[0].pageY };

          setRotation((prev) => ({
            x: Math.max(-0.8, Math.min(0.8, prev.x + dy * 0.008)),
            y: prev.y + dx * 0.01,
          }));
        } else if (touches.length >= 2 && initialPinchDistance.current !== null) {
          // Two fingers: pinch to zoom
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ratio = initialPinchDistance.current / distance;
          const newZoom = Math.max(1.8, Math.min(8.5, initialZoom.current * ratio));
          zoomRef.current = newZoom;
          setZoom(newZoom);
        }
      },
      onPanResponderRelease: () => {
        initialPinchDistance.current = null;
      },
    }),
  ).current;

  return (
    <View style={styles.screen}>
      <AnimatedGradientBackground />
      {focused && !stopped ? (
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <Canvas
            camera={{ position: [0, 0.4, zoom], fov: 46 }}
            gl={{ antialias: false }}
            style={styles.canvas}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[3, 5, 4]} intensity={1.5} />
            <directionalLight position={[-3, 2, -3]} intensity={0.6} />
            <pointLight position={[0, -2, 2]} intensity={0.5} color={appColors.secondary} />
            <Suspense fallback={null}>
              <MotionScene
                isTurbo={isTurbo}
                paused={false}
                rotationOffset={rotation}
                wireframe={wireframe}
              />
            </Suspense>
          </Canvas>
        </View>
      ) : (
        <View style={[styles.canvas, styles.pausedCanvas]}>
          <Text style={[styles.pausedText, { color: theme.textMuted }]}>
            Scene paused to save battery and GPU.
          </Text>
        </View>
      )}

      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/explore'))}
            style={styles.iconButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={appColors.primary} />
          </Pressable>
          <View style={styles.titleGroup}>
            <Text style={styles.kicker}>R3F ENGINE</Text>
            <Text style={styles.title}>Mercedes-AMG A45</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={stopped ? 'Resume scene' : 'Pause scene'}
            onPress={() => setStopped((current) => !current)}
            style={styles.iconButton}
          >
            <MaterialIcons
              name={stopped ? 'play-arrow' : 'pause'}
              size={22}
              color={appColors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.infoLabel}>CONTROLS</Text>
            <Text style={styles.infoTitle}>Drag / Pinch</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: wireframe }}
            onPress={() => setWireframe((current) => !current)}
            style={styles.iconButton}
            accessibilityLabel="Toggle wireframe"
          >
            <MaterialIcons
              name={wireframe ? 'grid-on' : 'grid-off'}
              size={22}
              color={appColors.primary}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsTurbo((current) => !current)}
            style={[styles.modeButton, { backgroundColor: theme.accent }]}
          >
            <MaterialIcons name="blur-circular" size={20} color={theme.accentText} />
            <Text style={[styles.modeText, { color: theme.accentText }]}>
              {isTurbo ? 'Calm' : 'Boost'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: appColors.background,
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  pausedCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pausedText: {
    fontSize: 14,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 112,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  titleGroup: {
    alignItems: 'center',
  },
  kicker: {
    color: appColors.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  title: {
    color: appColors.primary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  bottomBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    color: appColors.textMuted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  infoTitle: {
    color: appColors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '900',
  },
});
