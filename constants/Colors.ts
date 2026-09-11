/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { appColors } from './AppColors';

const tintColorLight = appColors.accentText;
const tintColorDark = appColors.accent;

export const Colors = {
  light: {
    text: appColors.accentText,
    background: '#fafafa',
    tint: tintColorLight,
    icon: appColors.secondary,
    border: appColors.border,
    tabIconDefault: appColors.secondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: appColors.text,
    background: appColors.background,
    tint: tintColorDark,
    icon: appColors.textSubtle,
    border: appColors.border,
    tabIconDefault: appColors.tabInactive,
    tabIconSelected: tintColorDark,
  },
};
