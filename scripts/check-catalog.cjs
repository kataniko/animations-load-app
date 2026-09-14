/* global __dirname */
// Run: node scripts/check-catalog.cjs
// Source/contrast regression checks; native visual checks are still required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const parse = file => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function nodes(source, predicate) {
  const found = [];
  function visit(node) {
    if (predicate(node)) found.push(node);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return found;
}
function constant(file, name, appColors) {
  const source = parse(file);
  const declaration = nodes(source, n => ts.isVariableDeclaration(n) && n.name.getText(source) === name)[0];
  const code = ts.transpileModule(`return (${declaration.initializer.getText(source)});`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return new Function('appColors', code)(appColors);
}
const appColors = constant('constants/AppColors.ts', 'appColors');
const palette = constant('context/ThemeContext.tsx', 'palette', appColors);
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
for (const [mode, theme] of Object.entries(palette)) {
  const ratios = [];
  for (const foreground of ['text', 'textMuted']) {
    for (const background of ['background', 'surface', 'surfaceElevated']) {
      const ratio = contrast(theme[foreground], theme[background]);
      assert(ratio >= 4.5, `${mode}: ${foreground}/${background}: ${ratio.toFixed(2)}:1`);
      ratios.push(ratio);
    }
  }
  const selected = contrast(theme.accentText, theme.accent);
  assert(selected >= 4.5, `${mode}: selected text contrast`);
  console.log(`${mode}: minimum text ${Math.min(...ratios).toFixed(2)}:1; selected ${selected.toFixed(2)}:1`);
}
const input = parse('components/gallery/BeamInput.tsx');
const effects = nodes(input, n => (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && ['BorderBeam', 'InnerBeamGlow'].includes(n.tagName.getText(input)));
assert.equal(effects.length, 1, 'md now owns its inward glow; do not layer a second glow over it');
for (const effect of effects) {
  const variant = effect.attributes.properties.find(p => p.name?.getText(input) === 'colorVariant');
  assert.equal(variant?.initializer?.text, 'colorful', 'The reference has colored edge light, not a monochrome ring');
}
assert(read('components/gallery/BeamInput.tsx').includes('size="md"'), 'Use the actual md composition');
assert(contrast(palette.dark.textMuted, '#202020') >= 4.5, 'Charcoal input placeholder contrast');
assert(contrast(palette.dark.text, '#2b2b2b') >= 4.5, 'Charcoal chip text contrast');
const glow = read('components/gallery/GlowInput.tsx');
assert(glow.includes('boxShadow:'), 'Glow must use a blurred shadow');
assert(!glow.includes('backgroundColor: theme.accent,'), 'Do not restore the solid accent backing');
assert(!glow.includes('scale:'), 'Do not scale a backing box outside the input');
console.log('Catalog and glow checks passed. Run check-beam-render.cjs for Skia pixel checks.');
