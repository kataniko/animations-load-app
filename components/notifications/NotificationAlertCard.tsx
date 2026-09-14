import { GlassCard } from '@/shared/glass/GlassCard';
import tw from '@/shared/tailwind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

export function NotificationAlertCard({ alert }: { alert: string }) {
  return (
    <GlassCard style={tw`rounded-[20px] flex-row gap-[14px] p-4`}>
      <View style={tw`items-center justify-center w-[42px] h-[42px] rounded-[18px] bg-[#27272a]`}>
        <MaterialIcons name="notifications-none" size={22} color="#fafafa" />
      </View>
      <View style={tw`flex-1 justify-center`}>
        <Text style={tw`text-base font-black text-[#fafafa]`}>{alert}</Text>
        <Text style={tw`text-[13px] font-bold mt-[3px] text-[#a3a3a3]`}>Tap to inspect recent updates</Text>
      </View>
    </GlassCard>
  );
}

