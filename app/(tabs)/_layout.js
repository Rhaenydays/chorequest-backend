import { StyleSheet, View } from 'react-native';
import AppNavigator from '../../components/navigation/AppNavigator';

export default function Layout() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the layout fills the screen
    backgroundColor: '#fff', // Optional: give a clean default background
  },
});
