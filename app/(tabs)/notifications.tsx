import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const alerts = [
  'Mara gostou do teu slot de motion.',
  'Load Studio mencionou-te numa thread de onboarding.',
  'Tiago guardou o teu prototipo de composer.',
  'Nova trend: animated tab indicator.',
];

export default function NotificationsScreen() {
  return (
    <View style={styles.background}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Alerts</Text>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {alerts.map((alert, index) => (
            <GlassCard key={alert} style={styles.alertRow}>
              <View style={[styles.alertIcon, index === 0 && styles.alertIconHot]}>
                <MaterialIcons name={index === 0 ? 'favorite' : 'bolt'} size={20} color="#fafafa" />
              </View>
              <View style={styles.alertCopy}>
                <Text style={styles.alertText}>{alert}</Text>
                <Text style={styles.alertTime}>{index + 1}h atras</Text>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  screen: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  title: {
    color: '#fafafa',
    fontSize: 30,
    fontWeight: '900',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  content: {
    gap: 12,
    padding: 18,
    paddingBottom: 30,
  },
  alertRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  alertIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  alertIconHot: {
    backgroundColor: '#d4d4d4',
  },
  alertCopy: {
    flex: 1,
  },
  alertText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  alertTime: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
});