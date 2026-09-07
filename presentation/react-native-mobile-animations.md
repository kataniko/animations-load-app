# React Native Mobile Animations
## Training Session

> Based on the existing `Animation Showcase` app.
>
> **Audience:** React Native / mobile developers  
> **Format:** live demo + two hands-on exercises

---

## Slide 01 — Cover

# React Native
# Mobile Animations

**From a visible state to a meaningful motion**

### Live app
`Animation Showcase`

**Presenter:** Tomás Oliveira

### Speaker notes
Open the app and go through the onboarding before starting the slides. The app is the presentation companion, not a fake product: every screen exists to demonstrate an animation concept.

---

## Slide 02 — Index

01. Why motion?
02. The React Native animation stack
03. Native Animated
04. Reanimated
05. Gestures and state
06. Theme transition
07. Reanimated vs Animated
08. Skia and React Three Fiber
09. Showcase
10. Hands-on
11. Q&A

---

## Slide 03 — Goals

- Understand the difference between **state**, **gesture**, and **animation**.
- Know when to use `Animated` and when to use Reanimated.
- Build motion that communicates feedback instead of adding decoration.
- Read an animation as a sequence of states.
- Leave with two small animations implemented in a real app.

### Speaker notes
The goal is not to learn every animation library. The goal is to choose the smallest tool that solves the interaction well.

---

## Slide 04 — What makes a mobile animation useful?

An animation should answer at least one question:

- Did my tap work?
- What changed?
- Where did this content come from?
- What can I drag?
- Is the app loading or ready?
- What is the relationship between these two states?

### The basic model

```text
state A → transition → state B
```

Examples in the app:

- onboarding page → next onboarding page;
- dark theme → light theme;
- closed navbar → expanded wizard;
- number 128 → number 129.

---

## Slide 05 — React Native Animated

`Animated` is part of React Native and is enough for many simple transitions.

```tsx
const translateX = useRef(new Animated.Value(0)).current;

Animated.timing(translateX, {
  toValue: -width,
  duration: 420,
  useNativeDriver: true,
}).start();
```

### Useful primitives

- `Animated.Value`
- `Animated.timing`
- `Animated.spring`
- `Animated.sequence`
- `Animated.parallel`
- `useNativeDriver`

### Used in this app

- `app/onboarding.tsx`
- `components/MaskedSplashScreen.tsx`
- onboarding object transition;
- splash sequence;
- mask reveal.

### Speaker notes
The onboarding object is intentionally simple. It leaves the current page, the content changes, and the object enters from the next page. This is a good first animation because the sequence is easy to reason about.

---

## Slide 06 — Reanimated

Reanimated is useful when animation needs to react continuously to UI input.

```tsx
const progress = useSharedValue(0);

const style = useAnimatedStyle(() => ({
  transform: [{ scale: 1 + progress.value * 0.08 }],
}));

progress.value = withSpring(1);
```

### Core concepts

- shared values;
- animated styles;
- worklets;
- `withSpring`;
- `withTiming`;
- derived values;
- UI-thread execution.

### Used in this app

- expandable bottom navbar;
- feed reveal;
- like burst;
- button motion;
- animated theme colors;
- animated number.

---

## Slide 07 — Animation is a state machine

Do not start with:

> “I want the button to move.”

Start with:

```text
idle → pressed → loading → success
```

### Example: expandable navbar

```text
collapsed
   ↓ tap
expanded / step 1
   ↓ select option
expanded / step 2
   ↓ Continue
expanded / step 3
   ↓ Open demo
closed + navigate
```

### Example: theme switch

```text
dark
   ↓ tap
circle expands
   ↓ full cover
light
   ↓ cleanup
normal light UI
```

### Speaker notes
The state determines what the animation means. Without explicit states, animations quickly become disconnected effects.

---

## Slide 08 — Gestures

A gesture gives the animation a continuous input.

```tsx
const pan = Gesture.Pan()
  .onUpdate((event) => {
    dragY.value = Math.max(0, event.translationY);
  })
  .onEnd((event) => {
    if (event.translationY > 120 || event.velocityY > 900) {
      closePanel();
    } else {
      dragY.value = withSpring(0);
    }
  });
```

### In the app

- drag the handle on the expandable navbar;
- release below the threshold to close;
- release above the threshold to return to the open position.

### Important rule

```text
gesture input → shared value → animated style → visible feedback
```

---

## Slide 09 — Dark / light theme transition

The theme transition combines two different animations:

### 1. A visual mask

A circle grows from the theme button until it covers the background.

### 2. Animated style values

Text, surfaces, borders, and accents interpolate their colors instead of switching instantly.

```tsx
interpolateColor(
  themeProgress.value,
  [0, 1],
  ['#f5f5f5', '#17191c'],
);
```

### Why not simply change the theme?

```tsx
color: isDark ? 'white' : 'black'
```

This is a discrete change. It can produce a visible flash.

### Better approach

```text
progress 0 → 1
color dark → color light
```

---

## Slide 10 — Animated number

The `animate-number` idea does not require a paid library.

### Free React Native alternative

```tsx
const value = useSharedValue(128);

value.value = withTiming(129, { duration: 450 });
```

The displayed value is derived from the animated value:

```tsx
text: `${Math.round(value.value)}`
```

### In the app

Open:

```text
Lab → Button Motion → Animate number
```

### What it demonstrates

- numeric interpolation;
- `withTiming`;
- `useAnimatedProps`;
- no Motion.dev dependency;
- no paid plugin;
- animation stays native.

---

## Slide 11 — Animated vs Reanimated

| Concern | Animated | Reanimated |
|---|---|---|
| Simple timing | Excellent | Excellent |
| Basic spring | Excellent | Excellent |
| Continuous gestures | Possible | Better fit |
| UI-thread logic | Limited | Strong |
| Derived values | Manual | Built in |
| Color interpolation | Possible | Convenient |
| Layout / complex interaction | More manual | Better fit |
| Dependency | React Native | Installed in this app |

### Rule of thumb

- Use `Animated` for a small, linear sequence.
- Use Reanimated when gesture, state, and motion interact continuously.
- Do not introduce a third library for a one-line transition.

---

## Slide 12 — Where do Skia and React Three Fiber fit?

### Skia

Good for:

- custom drawing;
- liquid blobs;
- masks and shaders;
- particles;
- morphing paths;
- canvas-based visual effects.

Not needed for:

- button scale;
- a spring;
- an animated number;
- a bottom sheet;
- a normal theme transition.

### React Three Fiber

Good for:

- 3D scenes;
- WebGL objects;
- lights and materials;
- per-frame animation.

### In this app

```text
Motion Orb → React Three Fiber
Button Motion → Reanimated
Theme transition → Reanimated + native Animated
```

### Speaker notes
Skia is a future option for a genuinely liquid theme transition. It is not automatically the simpler option for standard UI motion.

---

## Slide 13 — Showcase walkthrough

### 1. Onboarding

- press `Continuar`;
- observe the object leave and re-enter;
- press `Skip`;
- observe the object transition before navigation.

**Library:** React Native Animated

### 2. Home

- toggle dark / light mode;
- observe the circle and interpolated text colors;
- open the expandable navbar;
- drag the handle down;
- select the three wizard options.

**Library:** Reanimated + Gesture Handler

### 3. Lab

- open the animation catalogue;
- identify the library used by each demo.

### 4. Motion Orb

- switch between `Soft orbit` and `Turbo orbit`.

**Library:** React Three Fiber

---

## Slide 14 — Hands-on 01: Feed reveal

### Challenge

Animate a list of cards as they enter the screen.

Each card should:

- start below its final position;
- start transparent;
- enter with a spring;
- have a different delay.

### Target sequence

```text
card 1 → card 2 → card 3
```

### Suggested API

```tsx
<Animated.View
  entering={FadeInDown.delay(index * 90).springify()}
/>
```

### Discussion

- Why should the delay be based on `index`?
- What happens if every card starts at exactly the same time?
- When would a stagger become annoying?

**Library:** Reanimated

---

## Slide 15 — Hands-on 02: Like burst

### Challenge

Create a feedback animation for a favourite action.

On tap:

1. change the icon state;
2. scale the icon up;
3. emit small particles;
4. return to the resting state.

### Target sequence

```text
tap → scale → burst → settle
```

### Suggested API

```tsx
scale.value = withSequence(
  withSpring(1.25),
  withSpring(1),
);

burst.value = withTiming(1, { duration: 420 });
```

### Discussion

- Which part is React state?
- Which part is transient animation state?
- Why should particles not control the actual liked value?

**Library:** Reanimated

---

## Slide 16 — Questions

# Q&A

### Final takeaway

```text
Good motion is not decoration.
It explains state, feedback, and relationships.
```

### Live app routes

- `Home` — showcase and theme transition;
- `Lab` — animation catalogue;
- `Button Motion` — button and number demos;
- `3D` — React Three Fiber scene.

---

# Presenter checklist

## Before the session

- start the development build;
- open the app once so fonts and assets are loaded;
- verify the dark/light toggle;
- verify the expandable navbar drag threshold;
- open `Lab → Button Motion`;
- open `Motion Orb 3D`;
- keep the app on the onboarding screen before presenting.

## Demo order

```text
Onboarding
→ Home
→ Theme transition
→ Expandable navbar
→ Lab
→ Button Motion
→ Motion Orb 3D
→ Hands-on 01
→ Hands-on 02
→ Q&A
```

## Files used during the session

| Demo | File |
|---|---|
| Onboarding transition | `app/onboarding.tsx` |
| Theme transition | `context/ThemeContext.tsx` |
| Showcase home | `app/(tabs)/index.tsx` |
| Expandable navbar | `components/ExpandableBetTabBar.tsx` |
| Animation catalogue | `app/(tabs)/explore.tsx` |
| Buttons and number | `app/(tabs)/buttons.tsx` |
| 3D scene | `app/(tabs)/three.tsx` |
