// Front-end/src/utils/placeholderImages.js

/**
 * An array of placeholder food images URLs
 * These are used as fallbacks when Unsplash images cannot be loaded
 */
export const FOOD_PLACEHOLDER_IMAGES = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800", // Generic food
  "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800", // Pasta dish
  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800", // Pancakes 
  "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800", // Dessert
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=800", // Burger
  "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800", // Indian food
  "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800", // Paneer dish
  "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800", // Curry
  "https://images.pexels.com/photos/11170284/pexels-photo-11170284.jpeg?auto=compress&cs=tinysrgb&w=800", // Biryani
  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800", // Italian pasta
  "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800", // Pizza
  "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800", // Mexican/Taco
  "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=800", // Chinese food
  "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800", // Japanese food
  "https://images.pexels.com/photos/1234535/pexels-photo-1234535.jpeg?auto=compress&cs=tinysrgb&w=800", // Thai food
  "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800" // Salad
];

/**
 * Get a random food placeholder image URL
 * @returns {string} - URL to a food placeholder image
 */
export function getRandomFoodPlaceholder() {
  const randomIndex = Math.floor(Math.random() * FOOD_PLACEHOLDER_IMAGES.length);
  return FOOD_PLACEHOLDER_IMAGES[randomIndex];
}

/**
 * Get a food placeholder image based on food type
 * @param {string} foodType - Type of food (e.g., pasta, dessert)
 * @returns {string} - URL to a food placeholder image
 */
export function getFoodPlaceholder(foodType) {
  if (!foodType) return getRandomFoodPlaceholder();
  
  const foodTypeLower = foodType.toLowerCase();
  
  // Map of cuisine/dish types to image indexes
  const foodImageMap = {
    // Indian cuisine and dishes
    'indian': 5,
    'paneer': 6,
    'curry': 7,
    'biryani': 8,
    'masala': 5,
    'tikka': 5,
    
    // Italian cuisine and dishes
    'italian': 9,
    'pasta': 1,
    'pizza': 10,
    'spaghetti': 1,
    
    // Mexican cuisine and dishes
    'mexican': 11,
    'taco': 11,
    'burrito': 11,
    
    // Chinese cuisine and dishes
    'chinese': 12,
    'noodle': 12,
    
    // Japanese cuisine and dishes
    'japanese': 13,
    'sushi': 13,
    
    // Thai cuisine
    'thai': 14,
    
    // Generic food types
    'breakfast': 2,
    'pancake': 2,
    'dessert': 3,
    'cake': 3,
    'sweet': 3,
    'burger': 4,
    'sandwich': 4,
    'salad': 15
  };
  
  // Find the best matching category
  for (const [key, index] of Object.entries(foodImageMap)) {
    if (foodTypeLower.includes(key)) {
      return FOOD_PLACEHOLDER_IMAGES[index];
    }
  }
  
  // Default to random food image
  return getRandomFoodPlaceholder();
}