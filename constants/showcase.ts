// Local showcase content: standalone offline demos
export const libraries = [
  {
    id: 'animated', title: 'Animated', number: '01', icon: 'play-circle-outline',
    tagline: 'Built directly into React Native.',
    description: 'State transitions with timing curves, sequences, and native driver support. Best starting point for simple micro-interactions.',
    use: 'Onboarding flows, fades, translate animations, and quick sequences.',
    caution: 'Native driver does not support layout properties. Favor transform and opacity.',
    code: 'Animated.timing(progress, {\n  toValue: 1,\n  duration: 600,\n  useNativeDriver: true,\n}).start();',
    source: 'components/demos/AnimatedDemo.tsx',
  },
  {
    id: 'reanimated', title: 'Reanimated', number: '02', icon: 'animation',
    tagline: 'Spring physics on the UI thread.',
    description: 'Shared values run calculations on the native UI thread via worklets, keeping 60 FPS without React re-renders.',
    use: 'Micro-interactions, spring curves, layout transitions, and derived values.',
    caution: 'Animated styles belong on Animated components. Keep worklet dependencies minimal.',
    code: 'const x = useSharedValue(0);\nconst style = useAnimatedStyle(() => ({\n  transform: [{ translateX: x.value }],\n}));\nx.value = withSpring(200, { damping: 9 });',
    source: 'components/demos/SpringDemo.tsx',
  },
  {
    id: 'gestures', title: 'Gesture Handler', number: '03', icon: 'swipe',
    tagline: 'Direct finger manipulation.',
    description: 'Native touch recognition combined with Reanimated to map continuous drag gestures and snap states.',
    use: 'Swipeable cards, pan gestures, bottom sheets, and pinch-to-zoom.',
    caution: 'Gesture Handler tracks touch events; Reanimated drives visual feedback. Handle cancellation and scroll conflicts.',
    code: 'Gesture.Pan()\n  .onUpdate(e => { x.value = e.translationX; })\n  .onFinalize(() => {\n    x.value = withSpring(target);\n  });',
    source: 'components/demos/GestureDemo.tsx',
  },
  {
    id: 'skia', title: 'Skia', number: '04', icon: 'blur-on',
    tagline: 'High-performance 2D canvas.',
    description: 'Hardware-accelerated 2D drawing for paths, shaders, and image filters, such as liquid metaballs combining blur and color matrix.',
    use: 'Charts, organic liquids, custom path drawing, and pixel shaders.',
    caution: 'Skia renders directly to canvas; Reanimated supplies animated uniforms.',
    code: '<Group layer={<Paint>\n  <Blur blur={12} />\n  <ColorMatrix matrix={threshold} />\n</Paint>}>\n  <Circle cx={x} cy={90} r={40} />\n</Group>',
    source: 'components/demos/SkiaDemo.tsx',
  },
  {
    id: 'lottie', title: 'Lottie', number: '05', icon: 'movie',
    tagline: 'Vector timeline animations.',
    description: 'Renders After Effects JSON timelines natively on mobile platforms.',
    use: 'Hero illustrations, animated checkmarks, and celebration sequences.',
    caution: 'Test complex keyframes on device. Do not replace gesture physics with fixed timelines.',
    code: '<LottieView\n  ref={animation}\n  source={require("./success.json")}\n  loop={false}\n/>\nanimation.current?.play();',
    source: 'components/demos/LottieDemo.tsx',
  },
  {
    id: 'materials', title: 'Blur & Materials', number: '06', icon: 'layers',
    tagline: 'Layered visual depth.',
    description: 'BlurView creates background blur while LinearGradient provides light accents for translucent card surfaces.',
    use: 'Glass cards, modal overlays, and elevated sheets.',
    caution: 'On Android, configure BlurTargetView and blurMethod.',
    code: '<BlurTargetView ref={target}>\n  {background}\n</BlurTargetView>\n<BlurView blurTarget={target}\n  blurMethod="dimezisBlurViewSdk31Plus"\n  intensity={60} />',
    source: 'components/demos/MaterialDemo.tsx',
  },
  {
    id: 'three', title: 'React Three Fiber', number: '07', icon: 'view-in-ar',
    tagline: 'Real-time 3D scenes.',
    description: 'React renderer for Three.js with lights, camera controls, and geometry updated via useFrame.',
    use: 'Interactive 3D models, scene backgrounds, and spatial UI elements.',
    caution: 'Heavy GPU cost; ensure canvas pauses when off-screen.',
    code: 'useFrame((_, delta) => {\n  mesh.current.rotation.y += delta * speed;\n});\n// delta keeps rotation frame-rate independent.',
    source: 'app/(tabs)/three.tsx',
  },
] as const;

export type LibraryId = (typeof libraries)[number]['id'];

export const exercises = [
  {
    id: 'choose-tool',
    title: 'Exercise 1 · Pick the right tool',
    question: 'You need a simple opacity fade when a card mounts. What should you pick?',
    options: ['Animated', 'Gesture Handler', 'Skia'],
    answer: 'Animated',
    explanation: 'Animated is built-in and handles simple opacity and transform transitions without extra overhead.',
  },
  {
    id: 'gesture-flow',
    title: 'Exercise 2 · Separate gesture and motion',
    question: 'In a draggable card, what tracks the finger and what animates the snap back?',
    options: ['Skia tracks; Lottie animates', 'Gesture Handler tracks; Reanimated animates', 'Animated tracks; Skia animates'],
    answer: 'Gesture Handler tracks; Reanimated animates',
    explanation: 'Gesture Handler captures native gestures; Reanimated updates values on the UI thread and snaps back on release.',
  },
] as const;

export const presentationSteps = [
  { title: 'The Touch That Explains', minutes: '0–2 min', library: 'animated', say: 'Motion gives context. Feel the difference between an abrupt state switch and an animated transition.', action: 'Toggle Without motion / With motion and trigger the transition.' },
  { title: 'Spring Dynamics', minutes: '2–5 min', library: 'reanimated', say: 'Timing sets a fixed duration. Springs calculate velocity and damping.', action: 'Select Elastic, run both lanes, and test Button Motion.' },
  { title: 'Gesture-Driven State', minutes: '5–7 min', library: 'gestures', say: 'The finger directly controls position until release, where physics takes over.', action: 'Drag the card across the threshold and release on both sides.' },
  { title: 'Liquid Canvas', minutes: '7–10 min', library: 'skia', say: 'Instead of moving Views, we draw and blend pixels on a 2D canvas.', action: 'Toggle fusion off, move circles close, and re-enable fusion.' },
  { title: 'Timeline Playback', minutes: '10–12 min', library: 'lottie', say: 'Vector timelines allow designers to export intricate keyframed motion into product code.', action: 'Play, pause, and inspect 0%, 50%, and 100% keyframes.' },
  { title: 'Materials and Depth', minutes: '12–14 min', library: 'materials', say: 'Translucent materials preserve visual context between foreground and background.', action: 'Compare blur intensity at 0, 40, and 80%.' },
  { title: 'Real-Time 3D', minutes: '14–17 min', library: 'three', say: 'Meshes, lights, and materials run directly in React via WebGL shaders.', action: 'Open the scene, toggle Turbo speed, and switch wireframe mode.' },
] as const;
