import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const alerts = [
  'Mara gostou do teu slot de motion.',
  'Load Studio mencionou-te numa thread de onboarding.',
  'Tiago guardou o teu prototipo de composer.',
  'Nova trend: animated tab indicator.',
];

export default function NotificationsScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' }}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Alerts</Text>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {alerts.map((alert, index) => (
            <View key={alert} style={styles.alertRow}>
              <View style={[styles.alertIcon, index === 0 && styles.alertIconHot]}>
                <MaterialIcons name={index === 0 ? 'favorite' : 'bolt'} size={20} color="#fff7fb" />
              </View>
              <View style={styles.alertCopy}>
                <Text style={styles.alertText}>{alert}</Text>
                <Text style={styles.alertTime}>{index + 1}h atras</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0d0a12',
  },
  screen: {
    backgroundColor: 'rgba(8, 6, 12, 0.5)',
    flex: 1,
  },
  title: {
    color: '#fff7fb',
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
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  alertIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(240, 154, 214, 0.42)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  alertIconHot: {
    backgroundColor: '#f09ad6',
  },
  alertCopy: {
    flex: 1,
  },
  alertText: {
    color: '#fff7fb',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  alertTime: {
    color: '#c8b7c9',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
});