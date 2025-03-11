import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlurView } from 'expo-blur';
import caloriesApi from '../utils/caloriesApi';

interface FoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  nutritionalInfo?: string;
  healthBenefits?: string[];
  disadvantages?: string[];
  recommendations?: string;
}

interface AnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
  mealType?: string;
  healthScore?: number;
}

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  color?: string;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ label, value, unit, color = '#64B5F6' }) => (
  <ThemedView style={styles.nutritionCard}>
    <ThemedText style={styles.nutritionLabel}>{label}</ThemedText>
    <ThemedText style={[styles.nutritionValue, { color }]}>{value}{unit}</ThemedText>
  </ThemedView>
);

const GuideCard: React.FC = () => (
  <ThemedView style={styles.guideContainer}>
    <LinearGradient
      colors={['rgba(76, 102, 159, 0.1)', 'rgba(25, 47, 106, 0.1)']}
      style={styles.guideGradient}
    >
      <ThemedText style={styles.guideTitle}>
        <ThemedText>How to Use</ThemedText>
      </ThemedText>
      <ThemedView style={styles.guideSteps}>
        <ThemedView style={styles.guideStep}>
          <ThemedView style={styles.guideNumberContainer}>
            <ThemedText style={styles.guideNumber}>
              <ThemedText>1</ThemedText>
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.guideTextContainer}>
            <ThemedText style={styles.guideText}>
              <ThemedText>Tap "Select Photo" to choose a food image from your gallery</ThemedText>
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.guideStep}>
          <ThemedView style={styles.guideNumberContainer}>
            <ThemedText style={styles.guideNumber}>
              <ThemedText>2</ThemedText>
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.guideTextContainer}>
            <ThemedText style={styles.guideText}>
              <ThemedText>Wait while we analyze your food using AI</ThemedText>
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.guideStep}>
          <ThemedView style={styles.guideNumberContainer}>
            <ThemedText style={styles.guideNumber}>
              <ThemedText>3</ThemedText>
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.guideTextContainer}>
            <ThemedText style={styles.guideText}>
              <ThemedText>View detailed nutritional information and health insights</ThemedText>
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </LinearGradient>
  </ThemedView>
);

const FoodDetailCard: React.FC<{ food: FoodItem }> = ({ food }) => (
  <ThemedView style={styles.foodItemCard}>
    <ThemedView style={styles.foodHeader}>
      <ThemedText style={styles.foodName}>
        <ThemedText>{food.name}</ThemedText>
      </ThemedText>
      <ThemedText style={styles.calories}>
        <ThemedText>{food.calories} cal</ThemedText>
      </ThemedText>
    </ThemedView>
    
    {food.servingSize && (
      <ThemedText style={styles.servingSize}>
        <ThemedText>Serving: {food.servingSize}</ThemedText>
      </ThemedText>
    )}

    <ThemedView style={styles.nutritionGrid}>
      {food.protein && (
        <NutritionCard label="Protein" value={food.protein} unit="g" color="#4CAF50" />
      )}
      {food.carbs && (
        <NutritionCard label="Carbs" value={food.carbs} unit="g" color="#FFC107" />
      )}
      {food.fat && (
        <NutritionCard label="Fat" value={food.fat} unit="g" color="#FF5252" />
      )}
    </ThemedView>

    {food.nutritionalInfo && (
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>
          <ThemedText>Nutritional Value</ThemedText>
        </ThemedText>
        <ThemedText style={styles.infoText}>
          <ThemedText>{food.nutritionalInfo}</ThemedText>
        </ThemedText>
      </ThemedView>
    )}

    {food.healthBenefits && food.healthBenefits.length > 0 && (
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>
          <ThemedText>Health Benefits</ThemedText>
        </ThemedText>
        {food.healthBenefits.map((benefit, index) => (
          <ThemedView key={index} style={styles.benefitItem}>
            <ThemedText style={styles.bulletPoint}>
              <ThemedText>✓</ThemedText>
            </ThemedText>
            <ThemedText style={styles.benefitText}>
              <ThemedText>{benefit}</ThemedText>
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    )}

    {food.disadvantages && food.disadvantages.length > 0 && (
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>
          <ThemedText>Health Concerns</ThemedText>
        </ThemedText>
        {food.disadvantages.map((disadvantage, index) => (
          <ThemedView key={index} style={styles.disadvantageItem}>
            <ThemedText style={styles.bulletPoint}>
              <ThemedText>⚠️</ThemedText>
            </ThemedText>
            <ThemedText style={styles.disadvantageText}>
              <ThemedText>{disadvantage}</ThemedText>
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    )}

    {food.recommendations && (
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>
          <ThemedText>Recommendations</ThemedText>
        </ThemedText>
        <ThemedText style={styles.infoText}>
          <ThemedText>{food.recommendations}</ThemedText>
        </ThemedText>
      </ThemedView>
    )}
  </ThemedView>
);

const DeveloperCredit: React.FC = () => (
  <ThemedView style={styles.developerContainer}>
    <LinearGradient
      colors={['rgba(100, 181, 246, 0.1)', 'rgba(100, 181, 246, 0.05)']}
      style={styles.developerGradient}
    >
      <ThemedText style={styles.developerText}>
        <ThemedText>Developed by</ThemedText>
      </ThemedText>
      <ThemedText style={styles.developerName}>
        <ThemedText>Narva Siddhartha</ThemedText>
      </ThemedText>
    </LinearGradient>
  </ThemedView>
);

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
      
      if (analysisResult.foods.length === 0) {
        setError('No foods were detected in the image. Please try another photo.');
        setResult(null);
      } else {
        setResult(analysisResult);
      }
    } catch (err) {
      console.error('Error in analyzeFood:', err);
      setError('Failed to analyze image. Please try another photo or try again later.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2E" />
      <ScrollView 
        style={styles.container} 
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#1E1E2E', '#2D2D44']}
          style={styles.gradient}
        >
          <BlurView intensity={20} style={styles.blurContainer}>
            <ThemedView style={styles.content}>
              <ThemedView style={styles.header}>
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.titleGradient}
                >
                  <ThemedText style={styles.title}>Calories Tracker</ThemedText>
                  <ThemedText style={styles.subtitle}>
                    Snap • Analyze • Track
                  </ThemedText>
                </LinearGradient>
              </ThemedView>

              {!result && <GuideCard />}

              <ThemedView style={styles.mainContent}>
                <ThemedView style={styles.imageContainer}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                  ) : (
                    <ThemedView style={styles.placeholderImage}>
                      <LinearGradient
                        colors={['rgba(99, 102, 241, 0.1)', 'rgba(79, 70, 229, 0.1)']}
                        style={styles.placeholderGradient}
                      >
                        <ThemedText style={styles.placeholderText}>Tap to select food image</ThemedText>
                      </LinearGradient>
                    </ThemedView>
                  )}
                </ThemedView>

                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <ThemedView style={styles.button} onTouchEnd={pickImage}>
                    <ThemedText style={styles.buttonText}>
                      {image ? <ThemedText>📸 Choose Another Photo</ThemedText> : <ThemedText>📸 Select Photo</ThemedText>}
                    </ThemedText>
                  </ThemedView>
                </LinearGradient>

                {loading && (
                  <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <ThemedText style={styles.loadingText}>
                      <ThemedText>Analyzing your meal...</ThemedText>
                    </ThemedText>
                  </ThemedView>
                )}

                {error && (
                  <ThemedView style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>
                      <ThemedText>{error}</ThemedText>
                    </ThemedText>
                  </ThemedView>
                )}

                {result && (
                  <ThemedView style={styles.resultContainer}>
                    <LinearGradient
                      colors={['rgba(99, 102, 241, 0.1)', 'rgba(79, 70, 229, 0.1)']}
                      style={styles.resultGradient}
                    >
                      <ThemedText style={styles.resultTitle}>
                        <ThemedText>Analysis Results</ThemedText>
                      </ThemedText>

                      {result.healthScore && (
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                          style={styles.healthScoreContainer}
                        >
                          <ThemedText style={styles.healthScoreLabel}>
                            <ThemedText>Health Score</ThemedText>
                          </ThemedText>
                          <ThemedText style={[styles.healthScore, { 
                            color: result.healthScore > 70 ? '#4ADE80' : 
                                   result.healthScore > 40 ? '#FBBF24' : '#F87171'
                          }]}>
                            <ThemedText>{result.healthScore}%</ThemedText>
                          </ThemedText>
                        </LinearGradient>
                      )}

                      <ThemedView style={styles.foodList}>
                        {result.foods.map((food, index) => (
                          <FoodDetailCard key={index} food={food} />
                        ))}
                      </ThemedView>

                      <LinearGradient
                        colors={['rgba(99, 102, 241, 0.15)', 'rgba(79, 70, 229, 0.15)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.totalContainer}
                      >
                        <ThemedText style={styles.totalText}>
                          <ThemedText>Total Calories</ThemedText>
                        </ThemedText>
                        <ThemedText style={styles.totalCalories}>
                          <ThemedText>{result.totalCalories} cal</ThemedText>
                        </ThemedText>
                      </LinearGradient>
                    </LinearGradient>
                  </ThemedView>
                )}
              </ThemedView>

              <DeveloperCredit />
            </ThemedView>
          </BlurView>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CaloriesTracker;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
  },
  gradient: {
    flex: 1,
    minHeight: '100%',
  },
  blurContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 20 : 12,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  titleGradient: {
    padding: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 4,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  placeholderGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
  },
  buttonGradient: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  button: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 24,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.2)',
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    marginHorizontal: 4,
  },
  resultGradient: {
    padding: 24,
    paddingTop: 32,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    includeFontPadding: false,
    lineHeight: 32,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  healthScoreLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  healthScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  foodList: {
    gap: 16,
  },
  foodItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 20,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '600',
  },
  calories: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
    marginLeft: 10,
  },
  servingSize: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalCalories: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6366F1',
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: 48,
  },
  developerContainer: {
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 32 : 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  developerGradient: {
    padding: 16,
    alignItems: 'center',
  },
  developerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  developerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    marginTop: 4,
  },
  guideContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  guideGradient: {
    padding: 24,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  guideSteps: {
    gap: 16,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  guideNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideTextContainer: {
    flex: 1,
  },
  guideText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 24,
  },
  infoSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    color: '#6366F1',
    marginRight: 12,
    fontSize: 16,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  disadvantageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  disadvantageText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
}); 