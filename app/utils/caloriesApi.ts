import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "localhost:19000",
    "X-Title": "CaloriesTracker",
  }
});

const analyzeImage = async (imageBase64: string) => {
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide the following information in JSON format: 1. List of foods identified 2. Estimated calories for each item 3. Total calories. Make sure the response is valid JSON with these keys: foods (array of objects with name and calories), totalCalories (number)"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ]
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || '{"foods": [], "totalCalories": 0}');
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export default {
  analyzeImage
}; 