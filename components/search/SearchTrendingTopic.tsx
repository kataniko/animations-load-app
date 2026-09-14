import { GlassPressable } from '@/shared/glass/GlassPressable';
import tw from '@/shared/tailwind';
import { Text, View } from 'react-native';

export function SearchTrendingTopic({ topic }: { topic: string }) {
  return (
    <View style={tw`flex-1 min-h-[110px] rounded-[22px]`}>
      <GlassPressable
        onPress={() => { }}
        style={tw`flex-1 items-center justify-center rounded-[22px] p-4`}
      >
        <Text style={tw`text-[15px] font-extrabold text-center text-[#fafafa]`}>{topic}</Text>
      </GlassPressable>
    </View>
  );
}

