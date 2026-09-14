/* global __dirname */
// Real Skia/CanvasKit offscreen rendering. No simulator or extra dependencies.
// Run: node scripts/check-beam-render.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const root = path.resolve(__dirname, '..');

async function main() {
  global.CanvasKit = await require('canvaskit-wasm/bin/full/canvaskit.js')();
  const skia = require('@shopify/react-native-skia/lib/commonjs/headless');
  const source = fs.readFileSync(path.join(root, 'shared/effects/BeamComposition.tsx'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
  } }).outputText;
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    name => name === '@shopify/react-native-skia' ? skia : require(name), compiled, compiled.exports,
  );
  const { BeamComposition, beamColorMatrix, beamColors, beamPresets } = compiled.exports;
  const identity = beamColorMatrix(0, 1, 1);
  identity.forEach((value, index) => assert(Math.abs(value - ([0, 6, 12, 18].includes(index) ? 1 : 0)) < 0.001));
  const output = path.join(root, '.work/beam-renders');
  fs.mkdirSync(output, { recursive: true });
  const width = 350;
  const height = 122;
  const surface = skia.makeOffscreenSurface(width, height);
  const { Skia } = skia.getSkiaExports();
  async function render(theme, variant, phase, strength = 0.7, background = false) {
    surface.getCanvas().clear(Skia.Color('transparent'));
    const effect = React.createElement(skia.Group, { layer: React.createElement(skia.Paint, { opacity: strength }) },
      React.createElement(BeamComposition, {
        width, height, theme, colorVariant: variant, borderRadius: 20,
        rotation: [{ rotate: phase * Math.PI * 2 - Math.PI / 2 }],
        colorMatrix: beamColorMatrix(0, beamPresets[theme].saturation),
      }));
    const element = background ? React.createElement(skia.Group, null,
      React.createElement(skia.RoundedRect, { x: 0, y: 0, width, height, r: 20, color: theme === 'dark' ? '#202020' : '#f8fbff' }), effect) : effect;
    return skia.drawOffscreen(surface, element);
  }
  const pixels = image => image.readPixels(0, 0, { width, height, colorType: skia.ColorType.RGBA_8888, alphaType: skia.AlphaType.Unpremul });
  for (const theme of ['dark', 'light']) {
    for (const variant of Object.keys(beamColors)) {
      let previous;
      for (const phase of [0, 0.25, 0.5, 0.75]) {
        const image = await render(theme, variant, phase);
        if (theme === 'dark' && variant === 'colorful' && phase === 0) fs.writeFileSync(path.join(output, 'transparent-debug.png'), image.encodeToBytes());
        const rgba = pixels(image);
        assert(rgba, 'Pixel buffer available');
        let maxAlpha = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = rgba[(y * width + x) * 4 + 3];
            maxAlpha = Math.max(maxAlpha, alpha);
            if (x > 32 && x < width - 32 && y > 32 && y < height - 32) {
              assert(alpha <= 2, `${theme}/${variant}: unexpected interior fill at ${x},${y}: ${alpha}`);
            }
          }
        }
        assert(maxAlpha > 5, `${theme}/${variant}: effect is visible`);
        assert.equal(rgba[3], 0, 'Rounded corner stays transparent');
        if (previous) assert(rgba.some((value, i) => i % 4 === 3 && Math.abs(value - previous[i]) > 3), 'Reveal moves between phases');
        previous = rgba;
        image.dispose();
        if (variant === 'colorful') {
          const preview = await render(theme, variant, phase, 0.7, true);
          fs.writeFileSync(path.join(output, `${theme}-${phase}.png`), preview.encodeToBytes());
          preview.dispose();
        }
      }
    }
  }
  const hidden = await render('dark', 'colorful', 0, 0);
  assert(pixels(hidden).every((value, index) => index % 4 !== 3 || value === 0), 'Zero strength renders no effect');
  hidden.dispose();
  surface.dispose();
  console.log('Skia: 32 frames passed — transparent center/corners, visible edge light, moving reveal, zero strength.');
  console.log(`Previews: ${output}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
