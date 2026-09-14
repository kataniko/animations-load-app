import { useGLTF } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';
import type { Group } from 'three';

const modelSource = require('../../assets/3d/a45.glb');

export function MotionScene({
  isTurbo,
  paused,
  rotationOffset = { x: 0, y: 0 },
  wireframe,
}: {
  isTurbo: boolean;
  paused: boolean;
  rotationOffset?: { x: number; y: number };
  wireframe: boolean;
}) {
  const model = useRef<Group>(null);
  const autoAngle = useRef(0);
  const { scene } = useGLTF(modelSource) as { scene: Group };

  useFrame((_, delta) => {
    if (!paused) {
      autoAngle.current += delta * (isTurbo ? 0.7 : 0.25);
    }
    if (model.current) {
      model.current.rotation.x = rotationOffset.x;
      model.current.rotation.y = autoAngle.current + rotationOffset.y;
    }
  });

  return (
    <group ref={model} scale={0.1} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(modelSource);
