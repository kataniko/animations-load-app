import { exercises } from '@/constants/showcase';
import { useAppTheme } from '@/context/ThemeContext';
import { GlassCard } from '@/shared/glass/GlassCard';
import tw from '@/shared/tailwind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function Exercises() {
  const { theme } = useAppTheme();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <View style={tw`gap-3`}>
      {exercises.map((exercise, index) => {
        const selected = answers[exercise.id];
        const answered = selected !== undefined;
        return (
          <GlassCard key={exercise.id} style={tw`p-4`}>
            <Text style={[tw`text-[11px] font-black tracking-[1.2px]`, { color: theme.accent }]}>
              CHALLENGE {index + 1}
            </Text>
            <Text style={[tw`text-[18px] font-black mt-[6px]`, { color: theme.text }]}>
              {exercise.title.replace(`Exercise ${index + 1} · `, '')}
            </Text>
            <Text style={[tw`text-[15px] leading-[22px] mt-3`, { color: theme.text }]}>
              {exercise.question}
            </Text>
            <View style={tw`gap-2 mt-[14px]`}>
              {exercise.options.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected === option }}
                  onPress={() =>
                    setAnswers((current) => ({ ...current, [exercise.id]: option }))
                  }
                  style={[
                    tw`rounded-xl border px-3 py-3`,
                    {
                      borderColor: selected === option ? theme.accent : theme.border,
                      backgroundColor:
                        selected === option ? theme.surfaceElevated : 'transparent',
                    },
                  ]}
                >
                  <Text style={[tw`text-sm font-bold`, { color: theme.text }]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
            {answered && (
              <Text
                style={[
                  tw`text-sm leading-[21px] mt-[14px]`,
                  {
                    color:
                      selected === exercise.answer ? theme.accent : theme.textMuted,
                  },
                ]}
              >
                {selected === exercise.answer ? '✓ Correct. ' : 'Not quite. '}
                {exercise.explanation}
              </Text>
            )}
          </GlassCard>
        );
      })}
    </View>
  );
}

