/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { appColors } from './AppColors';

const tintColorLight = '#16883f';
const tintColorDark = appColors.pink;

export const Colors = {
  light: {
    text: '#142018',
    background: '#fbfaf4',
    tint: tintColorLight,
    icon: '#66746b',
    border: '#dedbd0',
    tabIconDefault: '#687076',
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
