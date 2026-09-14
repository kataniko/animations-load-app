import tw from '@/shared/tailwind';
import { Text, View } from 'react-native';

export function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={tw`items-center gap-1`}>
      <Text style={tw`text-[22px] font-black text-[#fafafa]`}>{value}</Text>
      <Text style={tw`text-xs font-bold text-[#a3a3a3]`}>{label}</Text>
    </View>
  );
}

