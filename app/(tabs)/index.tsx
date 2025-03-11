import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import CaloriesTracker from '@/components/CaloriesTracker';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <CaloriesTracker />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
