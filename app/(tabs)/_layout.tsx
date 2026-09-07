import { Tabs } from 'expo-router';
// import { AnimatedTabBar } from '../../components/AnimatedTabBar';
import CreateBetTabBar from '../../components/ExpandableBetTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CreateBetTabBar {...props} />}
      // tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Lab',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: '3D',
        }}
      />
      <Tabs.Screen
        name="buttons"
        options={{
          title: 'Buttons',
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
        }}
      />
    </Tabs>
  );
}
