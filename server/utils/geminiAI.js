// server/utils/geminiAI.js
const axios = require('axios');

// Use the provided API key or fall back to the default one
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function getAISuggestions(userQuery, ingredients = [], dietaryPreferences = []) {
    console.log('Getting AI suggestions for:', { userQuery, ingredients, dietaryPreferences });
    console.log('Using API key:', GEMINI_API_KEY.substring(0, 5) + '...');
    
    try {
        const prompt = `
As a culinary expert, please recommend 3-5 recipes based on the following information:

USER QUERY: "${userQuery}"
${ingredients.length > 0 ? `AVAILABLE INGREDIENTS: ${ingredients.join(', ')}` : ''}
${dietaryPreferences.length > 0 ? `DIETARY PREFERENCES: ${dietaryPreferences.join(', ')}` : ''}

For each recipe, provide ONLY the following information in a JSON array format:
[
  {
    "name": "Recipe Name",
    "description": "Brief 1-2 sentence description",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "cookingTime": "XX mins",
    "cuisine": "Italian/Mexican/Indian/etc",
    "difficulty": "Easy/Medium/Hard"
  },
  ...more recipes
]

Keep your response STRICTLY in this JSON format with NO additional text. The frontend will parse this JSON directly.
`;

        console.log('Sending request to Gemini API');
        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                timeout: 15000 // 15 second timeout
            }
        );
        console.log('Received response from Gemini API');
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = { getAISuggestions };
