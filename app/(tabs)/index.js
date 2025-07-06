import { View, Text } from 'react-native';
import { BASE_URL } from '@/constants/Api';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome Home</Text>
    </View>
  );
}
