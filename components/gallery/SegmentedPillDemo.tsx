import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const tabs = ['All', 'Motion', 'Canvas', '3D'];

export function SegmentedPillDemo({
  theme,
}: {
  theme: {
    accent: string;
    accentText: string;
    text: string;
    textMuted: string;
    surfaceElevated: string;
  };
}) {
  const [active, setActive] = useState(0);
  const offset = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const [trackWidth, setTrackWidth] = useState(0);
  const TAB_WIDTH = trackWidth / tabs.length;

  function selectTab(index: number) {
    setActive(index);
    offset.set(withSpring(index * TAB_WIDTH, { damping: 15, stiffness: 180 }));
  }

  return (
    <View
      onLayout={(event) =>
        setTrackWidth(Math.max(0, event.nativeEvent.layout.width - 6))
      }
      style={[styles.segmentedTrack, { backgroundColor: theme.surfaceElevated }]}
    >
      <Animated.View
        style={[
          styles.segmentedThumb,
          { width: TAB_WIDTH, backgroundColor: theme.accent },
          indicatorStyle,
        ]}
      />
      {tabs.map((tab, index) => {
        const isSelected = active === index;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => selectTab(index)}
            style={[styles.segmentedItem, { flex: 1 }]}
          >
            <Text
              style={[
                styles.segmentedText,
                { color: isSelected ? theme.accentText : theme.textMuted },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedTrack: {
    borderRadius: 14,
    flexDirection: 'row',
    minHeight: 54,
    padding: 3,
    position: 'relative',
    width: '100%',
  },
  segmentedThumb: {
    borderRadius: 11,
    bottom: 3,
    left: 3,
    position: 'absolute',
    top: 3,
  },
  segmentedItem: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentedText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
