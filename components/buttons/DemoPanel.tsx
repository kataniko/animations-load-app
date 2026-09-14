import type { useAppTheme } from '@/context/ThemeContext';
import tw from '@/shared/tailwind';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

export function DemoPanel({
  theme,
  title,
  library,
  surfaceStyle,
  borderStyle,
  children,
}: {
  theme: ReturnType<typeof useAppTheme>['theme'];
  title: string;
  library: string;
  surfaceStyle: object;
  borderStyle: object;
  children: ReactNode;
}) {
  return (
    <Animated.View style={[tw`rounded-[22px] border p-4`, surfaceStyle, borderStyle]}>
      <View style={tw`items-start gap-[5px] mb-4`}>
        <Animated.Text style={[tw`text-[18px] font-black`, { color: theme.text }]}>
          {title}
        </Animated.Text>
        <Animated.Text style={[tw`text-[11px] font-extrabold`, { color: theme.textMuted }]}>
          {library}
        </Animated.Text>
      </View>
      {children}
    </Animated.View>
  );
}

