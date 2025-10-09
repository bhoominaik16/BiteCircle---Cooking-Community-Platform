// Front-end/src/utils/nutritionCalculator.js

/**
 * Nutrition database with approximate values per 100g
 * These are sample values for demonstration purposes
 */
const nutritionDatabase = {
  // Proteins
  "chicken": { calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, sugar: 0, vitaminA: 15, vitaminC: 0, calcium: 15, iron: 1.1 },
  "beef": { calories: 250, protein: 26, fat: 17, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 2.5 },
  "pork": { calories: 242, protein: 25, fat: 16, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.9 },
  "tofu": { calories: 76, protein: 8, fat: 4, carbs: 2, fiber: 0.3, sugar: 0.5, vitaminA: 0, vitaminC: 0, calcium: 350, iron: 1.1 },
  "paneer": { calories: 265, protein: 18, fat: 21, carbs: 1.2, fiber: 0, sugar: 1.2, vitaminA: 130, vitaminC: 0, calcium: 510, iron: 0.3 },
  "eggs": { calories: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0, sugar: 1.1, vitaminA: 520, vitaminC: 0, calcium: 56, iron: 1.8 },
  "salmon": { calories: 208, protein: 20, fat: 13, carbs: 0, fiber: 0, sugar: 0, vitaminA: 50, vitaminC: 3.9, calcium: 9, iron: 0.3 },
  "tuna": { calories: 130, protein: 29, fat: 1, carbs: 0, fiber: 0, sugar: 0, vitaminA: 50, vitaminC: 0, calcium: 14, iron: 1.3 },
  
  // Dairy
  "milk": { calories: 42, protein: 3.4, fat: 1, carbs: 5, fiber: 0, sugar: 5, vitaminA: 63, vitaminC: 0, calcium: 120, iron: 0 },
  "yogurt": { calories: 59, protein: 3.5, fat: 3.3, carbs: 4.7, fiber: 0, sugar: 4.7, vitaminA: 36, vitaminC: 0.5, calcium: 120, iron: 0.1 },
  "cheese": { calories: 402, protein: 25, fat: 33, carbs: 1.3, fiber: 0, sugar: 0.1, vitaminA: 395, vitaminC: 0, calcium: 710, iron: 0.7 },
  "butter": { calories: 717, protein: 0.9, fat: 81, carbs: 0.1, fiber: 0, sugar: 0.1, vitaminA: 684, vitaminC: 0, calcium: 24, iron: 0 },
  "cream": { calories: 340, protein: 2, fat: 37, carbs: 2.8, fiber: 0, sugar: 2.8, vitaminA: 410, vitaminC: 0.5, calcium: 65, iron: 0 },
  
  // Grains
  "rice": { calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4, sugar: 0.1, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.2 },
  "pasta": { calories: 157, protein: 5.8, fat: 0.9, carbs: 31, fiber: 1.8, sugar: 0.6, vitaminA: 0, vitaminC: 0, calcium: 7, iron: 1.3 },
  "bread": { calories: 265, protein: 9, fat: 3.2, carbs: 49, fiber: 2.7, sugar: 5, vitaminA: 0, vitaminC: 0, calcium: 200, iron: 3.6 },
  "quinoa": { calories: 120, protein: 4.4, fat: 1.9, carbs: 21, fiber: 2.8, sugar: 0.9, vitaminA: 5, vitaminC: 0, calcium: 17, iron: 1.5 },
  "oats": { calories: 389, protein: 16.9, fat: 6.9, carbs: 66, fiber: 10.6, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 54, iron: 4.7 },
  
  // Vegetables
  "spinach": { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sugar: 0.4, vitaminA: 9420, vitaminC: 28, calcium: 99, iron: 2.7 },
  "broccoli": { calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6, fiber: 2.6, sugar: 1.7, vitaminA: 623, vitaminC: 89, calcium: 47, iron: 0.7 },
  "carrots": { calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, sugar: 4.7, vitaminA: 16706, vitaminC: 5.9, calcium: 33, iron: 0.3 },
  "tomatoes": { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, sugar: 2.6, vitaminA: 833, vitaminC: 13, calcium: 10, iron: 0.3 },
  "potatoes": { calories: 77, protein: 2, fat: 0.1, carbs: 17, fiber: 2.2, sugar: 0.8, vitaminA: 0, vitaminC: 19.7, calcium: 12, iron: 0.8 },
  "onion": { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3, fiber: 1.7, sugar: 4.2, vitaminA: 0, vitaminC: 7.4, calcium: 23, iron: 0.2 },
  "garlic": { calories: 149, protein: 6.4, fat: 0.5, carbs: 33, fiber: 2.1, sugar: 1, vitaminA: 0, vitaminC: 31, calcium: 181, iron: 1.7 },
  "bell peppers": { calories: 31, protein: 1, fat: 0.3, carbs: 6, fiber: 2.1, sugar: 4.2, vitaminA: 3131, vitaminC: 128, calcium: 10, iron: 0.4 },
  "lettuce": { calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, fiber: 1.3, sugar: 0.8, vitaminA: 7405, vitaminC: 9.2, calcium: 36, iron: 0.9 },
  
  // Fruits
  "apples": { calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, sugar: 10, vitaminA: 54, vitaminC: 4.6, calcium: 6, iron: 0.1 },
  "bananas": { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, sugar: 12, vitaminA: 64, vitaminC: 8.7, calcium: 5, iron: 0.3 },
  "oranges": { calories: 47, protein: 0.9, fat: 0.1, carbs: 12, fiber: 2.4, sugar: 9, vitaminA: 225, vitaminC: 53, calcium: 40, iron: 0.1 },
  "berries": { calories: 57, protein: 0.7, fat: 0.3, carbs: 14, fiber: 2.4, sugar: 5, vitaminA: 12, vitaminC: 9.7, calcium: 6, iron: 0.4 },
  "mango": { calories: 60, protein: 0.8, fat: 0.4, carbs: 15, fiber: 1.6, sugar: 14, vitaminA: 1262, vitaminC: 36, calcium: 11, iron: 0.2 },
  
  // Nuts & Seeds
  "almonds": { calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12, sugar: 4, vitaminA: 0, vitaminC: 0, calcium: 269, iron: 3.7 },
  "walnuts": { calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 7, sugar: 2.6, vitaminA: 20, vitaminC: 1.3, calcium: 98, iron: 2.9 },
  "cashews": { calories: 553, protein: 18, fat: 44, carbs: 30, fiber: 3.3, sugar: 5.9, vitaminA: 0, vitaminC: 0.5, calcium: 37, iron: 6.7 },
  "chia seeds": { calories: 486, protein: 17, fat: 31, carbs: 42, fiber: 34, sugar: 0, vitaminA: 15, vitaminC: 1.6, calcium: 631, iron: 7.7 },
  "flaxseeds": { calories: 534, protein: 18, fat: 42, carbs: 29, fiber: 27, sugar: 1.5, vitaminA: 0, vitaminC: 0.6, calcium: 255, iron: 5.7 },
  
  // Oils
  "olive oil": { calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.6 },
  "coconut oil": { calories: 862, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 },
  
  // Spices
  "salt": { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 24, iron: 0.3 },
  "pepper": { calories: 251, protein: 10, fat: 3.3, carbs: 64, fiber: 25, sugar: 0.6, vitaminA: 299, vitaminC: 0, calcium: 443, iron: 9.7 },
  "turmeric": { calories: 312, protein: 9.7, fat: 3.3, carbs: 67, fiber: 23, sugar: 3, vitaminA: 0, vitaminC: 0, calcium: 168, iron: 41 },
  "cumin": { calories: 375, protein: 18, fat: 22, carbs: 44, fiber: 11, sugar: 2.3, vitaminA: 1270, vitaminC: 7.7, calcium: 931, iron: 66 },
  "cinnamon": { calories: 247, protein: 4, fat: 1.2, carbs: 81, fiber: 53, sugar: 2.2, vitaminA: 295, vitaminC: 3.8, calcium: 1002, iron: 8.3 },
  
  // General catch-all terms
  "flour": { calories: 364, protein: 10, fat: 1, carbs: 76, fiber: 2.7, sugar: 0.3, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 4.6 },
  "sugar": { calories: 387, protein: 0, fat: 0, carbs: 100, fiber: 0, sugar: 100, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.1 },
  "water": { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 },
};

/**
 * Estimated portion sizes in grams for common ingredients
 */
const estimatedPortions = {
  // Proteins
  "chicken": 150,
  "beef": 150,
  "pork": 150,
  "tofu": 120,
  "paneer": 100,
  "eggs": 50, // per egg
  "salmon": 150,
  "tuna": 150,
  
  // Dairy
  "milk": 240, // about 1 cup
  "yogurt": 150,
  "cheese": 30,
  "butter": 14, // 1 tbsp
  "cream": 30, // 2 tbsp
  
  // Grains
  "rice": 180, // cooked
  "pasta": 140, // cooked
  "bread": 30, // per slice
  "quinoa": 170, // cooked
  "oats": 40, // uncooked
  
  // Vegetables
  "spinach": 30,
  "broccoli": 90,
  "carrots": 70,
  "tomatoes": 120,
  "potatoes": 170,
  "onion": 45,
  "garlic": 5, // cloves
  "bell peppers": 120,
  "lettuce": 50,
  
  // Fruits
  "apples": 180, // medium apple
  "bananas": 120, // medium banana
  "oranges": 130, // medium orange
  "berries": 150,
  "mango": 150,
  
  // Nuts & Seeds
  "almonds": 30, // about 23 almonds
  "walnuts": 30, // about 14 halves
  "cashews": 30, // about 18 cashews
  "chia seeds": 12, // 1 tbsp
  "flaxseeds": 10, // 1 tbsp
  
  // Oils
  "olive oil": 14, // 1 tbsp
  "coconut oil": 14, // 1 tbsp
  
  // Spices (relatively small amounts)
  "salt": 5, // about 1 tsp
  "pepper": 2,
  "turmeric": 2,
  "cumin": 2,
  "cinnamon": 2,
  
  // General
  "flour": 130, // about 1 cup
  "sugar": 12, // 1 tbsp
  "water": 240, // 1 cup
};

/**
 * Parse ingredient text to identify main ingredient
 * @param {string} ingredientText - The ingredient text to parse
 * @returns {object} - The identified ingredient and estimated quantity
 */
export const parseIngredient = (ingredientText) => {
  if (!ingredientText) return { ingredient: null, quantity: 0 };
  
  ingredientText = ingredientText.toLowerCase();
  
  // Try to find a match in our database
  let matchedIngredient = null;
  let bestMatchLength = 0;
  
  Object.keys(nutritionDatabase).forEach(ingredient => {
    if (ingredientText.includes(ingredient) && ingredient.length > bestMatchLength) {
      matchedIngredient = ingredient;
      bestMatchLength = ingredient.length;
    }
  });
  
  // If no match found, return null
  if (!matchedIngredient) return { ingredient: null, quantity: 0 };
  
  // Try to extract quantity from text
  let quantity = estimatedPortions[matchedIngredient] || 50; // Default to 50g if no estimated portion
  
  // Look for numeric quantity in the text
  const quantityMatch = ingredientText.match(/(\d+(\.\d+)?)\s*(g|grams|gram|oz|ounce|ounces|lb|pound|pounds|kg|cups|cup|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons)/);
  if (quantityMatch) {
    const value = parseFloat(quantityMatch[1]);
    const unit = quantityMatch[3].toLowerCase();
    
    // Convert to grams based on unit
    if (unit === 'oz' || unit === 'ounce' || unit === 'ounces') {
      quantity = value * 28.35; // 1 oz = 28.35g
    } else if (unit === 'lb' || unit === 'pound' || unit === 'pounds') {
      quantity = value * 453.59; // 1 lb = 453.59g
    } else if (unit === 'kg') {
      quantity = value * 1000; // 1 kg = 1000g
    } else if (unit === 'g' || unit === 'grams' || unit === 'gram') {
      quantity = value;
    } else if (unit === 'cups' || unit === 'cup') {
      // Rough estimation - different for different ingredients
      quantity = value * 240; // ~240g per cup as a general estimate
    } else if (unit === 'tbsp' || unit === 'tablespoon' || unit === 'tablespoons') {
      quantity = value * 15; // ~15g per tbsp
    } else if (unit === 'tsp' || unit === 'teaspoon' || unit === 'teaspoons') {
      quantity = value * 5; // ~5g per tsp
    }
  }
  
  return { ingredient: matchedIngredient, quantity };
};

/**
 * Calculate nutritional values for a given recipe
 * @param {array} ingredients - Array of ingredient strings
 * @returns {object} - Nutritional information
 */
export const calculateNutrition = (ingredients) => {
  // Initialize nutrition totals
  const nutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    sugar: 0,
    vitaminA: 0,
    vitaminC: 0, 
    calcium: 0,
    iron: 0
  };
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return nutrition;
  }
  
  // Analyze each ingredient
  ingredients.forEach(ingredientText => {
    const { ingredient, quantity } = parseIngredient(ingredientText);
    
    if (ingredient && nutritionDatabase[ingredient]) {
      const nutrientData = nutritionDatabase[ingredient];
      const factor = quantity / 100; // nutritional values are per 100g
      
      // Add to totals
      nutrition.calories += nutrientData.calories * factor;
      nutrition.protein += nutrientData.protein * factor;
      nutrition.fat += nutrientData.fat * factor;
      nutrition.carbs += nutrientData.carbs * factor;
      nutrition.fiber += nutrientData.fiber * factor;
      nutrition.sugar += nutrientData.sugar * factor;
      nutrition.vitaminA += nutrientData.vitaminA * factor;
      nutrition.vitaminC += nutrientData.vitaminC * factor;
      nutrition.calcium += nutrientData.calcium * factor;
      nutrition.iron += nutrientData.iron * factor;
    }
  });
  
  // Round values to make them more readable
  Object.keys(nutrition).forEach(key => {
    nutrition[key] = Math.round(nutrition[key] * 10) / 10;
  });
  
  return nutrition;
};

/**
 * Get Daily Value percentages based on recommended daily intake
 * @param {object} nutrition - The calculated nutrition values
 * @returns {object} - Daily value percentages
 */
export const calculateDailyValues = (nutrition) => {
  // Standard recommended daily values (for adults)
  const recommendedDaily = {
    calories: 2000,
    protein: 50,
    fat: 70,
    carbs: 300,
    fiber: 28,
    sugar: 50, // Upper limit
    vitaminA: 900, // mcg
    vitaminC: 90, // mg
    calcium: 1300, // mg
    iron: 18 // mg
  };
  
  const dailyValues = {};
  
  // Calculate percentages of daily values
  Object.keys(nutrition).forEach(nutrient => {
    if (recommendedDaily[nutrient]) {
      dailyValues[nutrient] = Math.round((nutrition[nutrient] / recommendedDaily[nutrient]) * 100);
    }
  });
  
  return dailyValues;
};