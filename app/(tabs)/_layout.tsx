import { Tabs } from 'expo-router';
// import { AnimatedTabBar } from '@/shared/navigation/AnimatedTabBar';
import CreateBetTabBar from '@/shared/navigation/ExpandableBetTabBar';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
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
          title: 'Libraries',
        }}
      />
    </Tabs>
  );
}
