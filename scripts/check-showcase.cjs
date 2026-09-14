// Run with: npm run check:showcase. No native runtime or test framework required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function load(file, imports = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    assert.ok(name in imports, `Unexpected import in ${file}: ${name}`);
    return imports[name];
  }, module, module.exports);
  return module.exports;
}

// Structural regression: execute the real GlassCard with lightweight host stubs.
// This catches the plain-View boundary that freezes Reanimated's internal refs.
// It does not replace a navigation/theme smoke test on a real device.
const AnimatedView = Symbol('Animated.View');
const jsx = (type, props) => ({ type, props });
const { GlassCard } = load('shared/glass/GlassCard.tsx', {
  'react/jsx-runtime': { jsx, jsxs: jsx },
  'react-native': { View: Symbol('View'), Platform: { OS: 'android' }, StyleSheet: { create: x => x, absoluteFill: {} } },
  'react-native-reanimated': { __esModule: true, default: { View: AnimatedView }, useAnimatedStyle: updater => ({ updater }) },
  'expo-blur': { BlurView: Symbol('BlurView') },
  'expo-glass-effect': { GlassView: Symbol('GlassView'), isLiquidGlassAvailable: () => false },
  'expo-linear-gradient': { LinearGradient: Symbol('LinearGradient') },
  '@/context/ThemeContext': { useAppTheme: () => ({ themeProgress: { value: 0 } }) },
});
const animatedStyle = { viewDescriptors: { current: undefined } };
const card = GlassCard({ style: animatedStyle, children: 'demo' });
assert.equal(card.type, AnimatedView, 'GlassCard must consume animated styles with Animated.View');
assert.ok(card.props.style.includes(animatedStyle), 'Keep the caller style on the animated host');
assert.equal(Object.isFrozen(animatedStyle.viewDescriptors), false);

const { libraries, presentationSteps } = load('constants/showcase.ts');
const ids = libraries.map(item => item.id);
assert.equal(new Set(ids).size, ids.length, 'Library IDs must be unique');
assert.equal(libraries.length, 7);
for (const library of libraries) {
  const resolvedSource = library.source.replace(/^components\//, 'shared/');
  assert.ok(
    fs.existsSync(path.join(root, library.source)) || fs.existsSync(path.join(root, resolvedSource)),
    `Missing demo: ${library.source}`
  );
  assert.ok(library.code && library.caution);
}
for (const step of presentationSteps) {
  assert.ok(ids.includes(step.library), `Broken presentation link: ${step.library}`);
  assert.ok(step.say && step.action);
}
const animation = JSON.parse(fs.readFileSync(path.join(root, 'assets/animations/success.json'), 'utf8'));
assert.equal(animation.op / animation.fr, 1.5);
assert.equal(animation.layers[0].nm, 'Check', 'The check must render above the filled circle');
assert.deepEqual(animation.assets, [], 'Presentation assets must work offline');
console.log('OK: animated GlassCard boundary, 7 demo sources, presentation links and local Lottie asset.');
