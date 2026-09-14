import { NotificationAlertCard } from '@/components/notifications/NotificationAlertCard';
import { AnimatedGradientBackground } from '@/shared/backgrounds/AnimatedGradientBackground';
import { ThemedText } from '@/shared/themed/ThemedText';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const alerts = [
  'Skia custom shader ready for preview.',
  'Frame rate stable at 60 FPS.',
  'Presentation notes updated.',
];

export default function NotificationsScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.heading}>
            Notifications
          </ThemedText>
          <ThemedText style={styles.subheading}>
            Performance metrics and component updates.
          </ThemedText>
          <View style={styles.list}>
            {alerts.map((alert) => (
              <NotificationAlertCard key={alert} alert={alert} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#09090b',
    flex: 1,
  },
  screen: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  heading: {
    color: '#fafafa',
    fontSize: 32,
    fontWeight: '900',
  },
  subheading: {
    color: '#a3a3a3',
    fontSize: 15,
    marginTop: 6,
  },
  list: {
    gap: 12,
    marginTop: 20,
  },
});
