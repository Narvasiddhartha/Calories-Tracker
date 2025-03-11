import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import caloriesApi from '../utils/caloriesApi';

interface FoodItem {
  name: string;
  calories: number;
}

interface AnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
}

const CaloriesTracker: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      analyzeFood(result.assets[0].base64);
    }
  };

  const analyzeFood = async (base64Image: string) => {
    try {
      setLoading(true);
      setError(null);
      const analysisResult = await caloriesApi.analyzeImage(base64Image);
      setResult(analysisResult);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Calories Tracker</ThemedText>
        <ThemedText style={styles.subtitle}>
          Take a photo of your food to calculate calories
        </ThemedText>

        <ThemedView style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <ThemedView style={styles.placeholderImage}>
              <ThemedText>No image selected</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.button} onTouchEnd={pickImage}>
          <ThemedText style={styles.buttonText}>
            {image ? 'Choose Another Photo' : 'Select Photo'}
          </ThemedText>
        </ThemedView>

        {loading && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <ThemedText style={styles.loadingText}>Analyzing image...</ThemedText>
          </ThemedView>
        )}

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        {result && (
          <ThemedView style={styles.resultContainer}>
            <ThemedText style={styles.resultTitle}>Analysis Results:</ThemedText>
            {result.foods.map((food, index) => (
              <ThemedView key={index} style={styles.foodItem}>
                <ThemedText style={styles.foodName}>{food.name}</ThemedText>
                <ThemedText style={styles.calories}>{food.calories} cal</ThemedText>
              </ThemedView>
            ))}
            <ThemedView style={styles.totalContainer}>
              <ThemedText style={styles.totalText}>Total Calories:</ThemedText>
              <ThemedText style={styles.totalCalories}>
                {result.totalCalories} cal
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
};

export default CaloriesTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodName: {
    fontSize: 16,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c669f',
  },
}); 