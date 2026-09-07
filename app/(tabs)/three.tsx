/* eslint-disable react/no-unknown-property */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import type { Group, Mesh } from 'three';

import { appColors } from '@/constants/AppColors';

const particleCount = 34;

export default function ThreeLabScreen() {
  const [isTurbo, setIsTurbo] = useState(false);
  const { theme } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Canvas
        camera={{ fov: 48, position: [0, 0.25, 6.2] }}
        gl={{ antialias: true }}
        style={styles.canvas}>
        <color attach="background" args={[theme.background]} />
        <ambientLight intensity={0.55} />
        <directionalLight color="#fff7fb" intensity={2.2} position={[3.2, 4.4, 5]} />
        <pointLight color={appColors.pink} intensity={28} position={[-3.2, 1.2, 3.4]} />
        <pointLight color={appColors.lavender} intensity={16} position={[2.8, -1.4, 3.2]} />
        <MotionScene isTurbo={isTurbo} />
      </Canvas>

      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color={theme.text} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>React Three Fiber Native</Text>
            <Text style={[styles.title, { color: theme.text }]}>Motion Orb</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setIsTurbo((current) => !current)} style={styles.iconButton}>
            <MaterialIcons name={isTurbo ? 'flash-on' : 'flash-off'} size={22} color={appColors.gold} />
          </Pressable>
        </View>

        <View style={styles.infoPanel}>
          <View>
            <Text style={styles.infoLabel}>Scene status</Text>
            <Text style={[styles.infoTitle, { color: theme.text }]}>{isTurbo ? 'Turbo orbit' : 'Soft orbit'}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setIsTurbo((current) => !current)} style={[styles.modeButton, { backgroundColor: theme.accent }]}>
            <MaterialIcons name="blur-circular" size={20} color="#171717" />
            <Text style={styles.modeText}>{isTurbo ? 'Calm' : 'Boost'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function MotionScene({ isTurbo }: { isTurbo: boolean }) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const speed = isTurbo ? 1.35 : 0.62;
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => {
        const angle = (index / particleCount) * Math.PI * 2;
        const lane = index % 3;
        const radius = 1.9 + lane * 0.52;

        return {
          angle,
          color: lane === 0 ? appColors.pink : lane === 1 ? appColors.gold : appColors.lavender,
          radius,
          scale: 0.035 + (index % 5) * 0.008,
          y: (index % 7) * 0.18 - 0.54,
        };
      }),
    []
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y += delta * speed;
      group.current.rotation.x = Math.sin(elapsed * 0.38) * 0.16;
    }

    if (core.current) {
      core.current.rotation.x += delta * (0.52 + speed * 0.35);
      core.current.rotation.y -= delta * (0.44 + speed * 0.3);
      const pulse = 1 + Math.sin(elapsed * 2.1) * 0.045;
      core.current.scale.setScalar(pulse);
    }

    if (ring.current) {
      ring.current.rotation.z -= delta * (0.7 + speed * 0.46);
      ring.current.rotation.x = Math.PI / 2.42 + Math.sin(elapsed * 0.7) * 0.16;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={core} position={[0, 0.06, 0]}>
        <icosahedronGeometry args={[1.08, 4]} />
        <meshStandardMaterial color={appColors.orange} roughness={0.34} metalness={0.38} />
      </mesh>

      <mesh ref={ring} position={[0, 0.02, 0]}>
        <torusKnotGeometry args={[1.58, 0.035, 164, 12, 2, 5]} />
        <meshStandardMaterial color={appColors.text} roughness={0.22} metalness={0.64} />
      </mesh>

      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(particle.angle) * particle.radius,
            particle.y,
            Math.sin(particle.angle) * particle.radius,
          ]}
          scale={particle.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={particle.color} emissive={particle.color} emissiveIntensity={0.42} />
        </mesh>
      ))}
    </group>
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
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  titleBlock: {
    flex: 1,
  },
  kicker: {
    color: appColors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: appColors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },
  infoPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 16, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  infoLabel: {
    color: appColors.textSubtle,
    fontSize: 12,
    fontWeight: '800',
  },
  infoTitle: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: appColors.gold,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  modeText: {
    color: '#171717',
    fontSize: 13,
    fontWeight: '900',
  },
});
