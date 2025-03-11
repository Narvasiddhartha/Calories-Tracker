import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "localhost:19000",
    "X-Title": "CaloriesTracker",
  }
});

const extractJSONFromText = (text: string): string => {
  // Try to find JSON content between curly braces
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : '{"foods": [], "totalCalories": 0}';
};

interface FoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  nutritionalInfo?: string;
  healthBenefits?: string[];
  recommendations?: string;
}

interface AnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
  mealType?: string;
  healthScore?: number;
}

const foodDatabase: { [key: string]: Partial<FoodItem> } = {
  apple: {
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: "1 medium apple (182g)",
    nutritionalInfo: "Rich in fiber, vitamin C, and various antioxidants. Contains natural sugars and pectin.",
    healthBenefits: [
      "Supports heart health",
      "May lower risk of type 2 diabetes",
      "Promotes good gut bacteria",
      "Contains powerful antioxidants"
    ],
    recommendations: "Best eaten fresh with skin on. Can be included in breakfast or as a healthy snack."
  },
  banana: {
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: "1 medium banana (118g)",
    nutritionalInfo: "Excellent source of vitamin B6, potassium, and fiber. Natural energy booster.",
    healthBenefits: [
      "Supports digestive health",
      "Good for heart health",
      "Provides sustained energy",
      "Helps in muscle recovery"
    ],
    recommendations: "Perfect pre or post-workout snack. Ripe bananas are easier to digest."
  },
  rice: {
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    servingSize: "1 cup cooked (158g)",
    nutritionalInfo: "Primary source of complex carbohydrates. Contains essential minerals and B vitamins.",
    healthBenefits: [
      "Provides sustained energy",
      "Gluten-free grain option",
      "Easy to digest",
      "Versatile ingredient"
    ],
    recommendations: "Choose brown rice for more fiber and nutrients. Portion control is important for weight management."
  },
  chicken: {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: "100g (3.5 oz)",
    nutritionalInfo: "High-quality protein source, rich in essential amino acids. Contains B vitamins and minerals.",
    healthBenefits: [
      "Supports muscle growth and repair",
      "Helps maintain healthy bones",
      "Good for weight management",
      "Rich in essential nutrients"
    ],
    recommendations: "Best grilled or baked. Remove skin to reduce fat content. Pair with vegetables for a balanced meal."
  },
  salad: {
    calories: 100,
    protein: 2,
    carbs: 12,
    fat: 7,
    servingSize: "2 cups (100g)",
    nutritionalInfo: "Mix of fresh vegetables providing various vitamins, minerals, and fiber. Healthy fats from dressing.",
    healthBenefits: [
      "Rich in antioxidants",
      "Supports digestive health",
      "Helps with hydration",
      "Low in calories, high in nutrients"
    ],
    recommendations: "Use light dressing to keep calories in check. Add protein for a complete meal."
  }
};

const getFoodDetails = (foodName: string): Partial<FoodItem> => {
  const lowercaseFoodName = foodName.toLowerCase();
  for (const [key, value] of Object.entries(foodDatabase)) {
    if (lowercaseFoodName.includes(key)) {
      return value;
    }
  }
  
  return {};
};

const getMealType = (foods: FoodItem[]): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 15) return "Lunch";
  if (hour >= 15 && hour < 18) return "Snack";
  if (hour >= 18 && hour < 22) return "Dinner";
  return "Late Night Meal";
};

const calculateHealthScore = (foods: FoodItem[]): number => {
  // This is a simplified health score calculation
  let score = 70; // Base score
  
  // Analyze macronutrient balance
  const hasProtein = foods.some(food => food.protein && food.protein > 5);
  const hasHealthyFats = foods.some(food => food.fat && food.fat < 15);
  const hasModerateCarbs = foods.some(food => food.carbs && food.carbs < 50);
  
  if (hasProtein) score += 10;
  if (hasHealthyFats) score += 10;
  if (hasModerateCarbs) score += 10;
  
  // Penalize for very high calorie meals
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  if (totalCalories > 800) score -= 20;
  
  return Math.min(100, Math.max(0, score));
};

const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a food calorie analyzer. Analyze this food image and provide ONLY a JSON response with this exact format, no other text or explanation: {\"foods\": [{\"name\": \"food name\", \"calories\": number}], \"totalCalories\": number}. Be precise with food names and realistic with calorie counts. Do not include any other fields or text in the response."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const content = completion.choices[0].message.content || '';
    console.log('Raw API response:', content);

    // Clean up the response to ensure valid JSON
    const cleanedContent = content.replace(/[\r\n\t]/g, '').trim();
    const jsonMatch = cleanedContent.match(/\{.*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Return a default structure if parsing fails
      parsedResponse = {
        foods: [],
        totalCalories: 0
      };
    }

    // Validate and fix the response structure if needed
    if (!Array.isArray(parsedResponse.foods)) {
      parsedResponse.foods = [];
    }

    // Ensure each food item has required fields
    parsedResponse.foods = parsedResponse.foods.map((food: any) => ({
      name: String(food.name || ''),
      calories: Number(food.calories || 0)
    }));

    // Enhance the response with additional food information
    const enhancedFoods = parsedResponse.foods.map((food: FoodItem) => {
      const foodDetails = getFoodDetails(food.name);
      return {
        ...food,
        ...foodDetails,
        // Ensure we keep the AI-detected calories if available
        calories: food.calories || foodDetails.calories || 0,
      };
    });

    const totalCalories = enhancedFoods.reduce((sum: number, food: FoodItem) => sum + (food.calories || 0), 0);
    const mealType = getMealType(enhancedFoods);
    const healthScore = calculateHealthScore(enhancedFoods);

    return {
      foods: enhancedFoods,
      totalCalories,
      mealType,
      healthScore
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Return a valid response even if there's an error
    return {
      foods: [],
      totalCalories: 0,
      mealType: getMealType([]),
      healthScore: 70
    };
  }
};

export default {
  analyzeImage
}; 