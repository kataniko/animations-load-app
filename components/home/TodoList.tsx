import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from '@/shared/glass/GlassCard';
import {
  useAnimatedThemeBackground,
  useAnimatedThemeBorder,
  useAnimatedThemeColor,
} from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcons);

type Task = {
  label: string;
  done: boolean;
};

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { label: 'Plan next motion pattern', done: true },
    { label: 'Test touch feedback on device', done: false },
    { label: 'Ship release build', done: false },
  ]);

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <GlassCard style={styles.todoCard}>
        {tasks.map((task, index) => (
          <TodoRow
            key={task.label}
            task={task}
            index={index}
            onPress={() =>
              setTasks((current) =>
                current.map((item) =>
                  item.label === task.label ? { ...item, done: !item.done } : item,
                ),
              )
            }
          />
        ))}
      </GlassCard>
    </Animated.View>
  );
}

function TodoRow({
  task,
  index,
  onPress,
}: {
  task: Task;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const textStyle = useAnimatedThemeColor('#e4e4e7', '#18181b');
  const checkboxBorderStyle = useAnimatedThemeBorder('#27272a', '#d4d4d8');
  const checkboxBackgroundStyle = useAnimatedThemeBackground('#fafafa', '#18181b');
  const checkColorStyle = useAnimatedThemeColor('#18181b', '#fafafa');
  const rowBorderStyle = useAnimatedThemeBorder('rgba(255,255,255,0.08)', 'rgba(24,24,27,0.08)');

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <AnimatedPressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        onPress={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSequence(withSpring(0.94), withSpring(1));
          onPress();
        }}
        style={[styles.todoRow, rowBorderStyle, style]}
      >
        <Animated.View
          style={[
            styles.checkbox,
            checkboxBorderStyle,
            task.done && [checkboxBackgroundStyle, checkboxBorderStyle],
          ]}
        >
          {task.done && <AnimatedMaterialIcon name="check" size={16} style={checkColorStyle} />}
        </Animated.View>
        <Animated.Text style={[styles.todoText, textStyle, task.done && styles.todoTextDone]}>
          {task.label}
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  todoRow: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  todoTextDone: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
});
