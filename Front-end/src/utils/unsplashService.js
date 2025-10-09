// Front-end/src/utils/unsplashService.js
import { UNSPLASH_ACCESS_KEY } from './config';
import { getFoodSearchTerm, getCuisineSearchTerm } from './foodCategories';
import imageCache from './imageCache';

// Track API request count to avoid hitting rate limits
let apiRequestCount = 0;
let lastReset = Date.now();
const MAX_REQUESTS_PER_HOUR = 50; // Conservative limit to stay under Unsplash free tier

/**
 * Fetch an image from Unsplash API for a recipe
 * @param {string} recipeName - Name of the recipe
 * @returns {Promise<object>} - Object containing URL of the image and attribution data
 */
export async function fetchRecipeImage(recipeName) {
  try {
    if (!recipeName) {
      throw new Error('Recipe name is required');
    }
    
    // Check cache first to avoid duplicate API calls
    const cachedResult = imageCache.get(recipeName);
    if (cachedResult) {
      console.log(`Using cached image for: ${recipeName}`);
      return cachedResult;
    }
    
    // Get a specific food category for better matching
    const foodCategory = getFoodCategory(recipeName);
    console.log(`Searching for images matching: ${foodCategory}`);
    
    // Check if we have an API key
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY') {
      // Reset API counter if an hour has passed
      if (Date.now() - lastReset > 3600000) {
        apiRequestCount = 0;
        lastReset = Date.now();
      }
      
      // Check if we're approaching rate limits
      if (apiRequestCount >= MAX_REQUESTS_PER_HOUR) {
        console.warn('Approaching Unsplash API rate limit, using fallback image');
        return getDefaultImage(recipeName);
      }
      
      // Always use the enhanced search term from our helper
      const query = foodCategory;
      
      // For specific cuisines, add additional context if not already included
      let enhancedQuery = query;
      const recipeLower = recipeName.toLowerCase();
      
      // Ensure we have proper food context in the query
      if (!enhancedQuery.includes('dish') && !enhancedQuery.includes('food')) {
        enhancedQuery += ' dish';
      }
      
      console.log(`Enhanced query: ${enhancedQuery}`);
      
      try {
        // Track API request
        apiRequestCount++;
        
        // First try with our enhanced query
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(enhancedQuery)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5&orientation=landscape`
        );
        
        if (!response.ok) {
          const errorStatus = response.status;
          
          // Handle rate limiting explicitly
          if (errorStatus === 429) {
            console.error('Unsplash API rate limit exceeded');
            apiRequestCount = MAX_REQUESTS_PER_HOUR; // Prevent further requests
            throw new Error('Rate limit exceeded');
          }
          
          throw new Error(`Unsplash API returned ${errorStatus}`);
        }
        
        const data = await response.json();
        
        // Check if we have results
        if (data.results && data.results.length > 0) {
          // Select the best image from the results (first one typically)
          const photo = data.results[0];
          
          console.log(`Found ${data.results.length} images, using: ${photo.urls.regular.substring(0, 50)}...`);
          
          // Create result object with full attribution as required by Unsplash
          const result = {
            imageUrl: photo.urls.regular,
            smallImageUrl: photo.urls.small,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            unsplashUrl: photo.links.html
          };
          
          // Cache the result for future use
          imageCache.set(recipeName, result);
          
          return result;
        } else {
          // If no results, try a more generic search for the cuisine
          console.log('No results found with specific query, trying more generic search');
          
          // Extract cuisine from recipe name if possible
          let cuisine = detectCuisine(recipeLower);
          
          // Track API request
          apiRequestCount++;
          
          const fallbackResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cuisine + ' food')}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5&orientation=landscape`
          );
          
          if (!fallbackResponse.ok) {
            throw new Error(`Unsplash API returned ${fallbackResponse.status}`);
          }
          
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.results && fallbackData.results.length > 0) {
            const fallbackPhoto = fallbackData.results[0];
            console.log(`Found ${fallbackData.results.length} images with generic search, using: ${fallbackPhoto.urls.regular.substring(0, 50)}...`);
            
            // Create result with full attribution
            const result = {
              imageUrl: fallbackPhoto.urls.regular,
              smallImageUrl: fallbackPhoto.urls.small,
              photographer: fallbackPhoto.user.name,
              photographerUrl: fallbackPhoto.user.links.html,
              unsplashUrl: fallbackPhoto.links.html
            };
            
            // Cache the result
            imageCache.set(recipeName, result);
            
            return result;
          }
        }
      } catch (apiError) {
        console.error('Error with Unsplash API:', apiError);
        // Continue to fallback method below
      }
    }
    
    // If no API key or no results, use the Unsplash Source API (no key required)
    return getDefaultImage(recipeName);
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return getDefaultImage(recipeName);
  }
}

/**
 * Detect cuisine from recipe name
 * @param {string} recipeName - Lowercase recipe name
 * @returns {string} - Cuisine type
 */
function detectCuisine(recipeName) {
  if (!recipeName) return 'food';
  
  if (recipeName.includes('indian') || 
      recipeName.includes('paneer') || 
      recipeName.includes('curry') || 
      recipeName.includes('masala') ||
      recipeName.includes('tikka')) return 'indian';
      
  if (recipeName.includes('italian') || 
      recipeName.includes('pasta') || 
      recipeName.includes('pizza') ||
      recipeName.includes('risotto')) return 'italian';
      
  if (recipeName.includes('mexican') || 
      recipeName.includes('taco') || 
      recipeName.includes('burrito') ||
      recipeName.includes('quesadilla')) return 'mexican';
      
  if (recipeName.includes('chinese') || 
      recipeName.includes('stir fry') || 
      recipeName.includes('dumpling')) return 'chinese';
      
  if (recipeName.includes('japanese') || 
      recipeName.includes('sushi') || 
      recipeName.includes('ramen')) return 'japanese';
      
  if (recipeName.includes('thai')) return 'thai';
  
  return 'food';
}

/**
 * Get a default image URL using Unsplash Source
 * This method doesn't require an API key and works directly
 * @param {string} query - Search term
 * @returns {object} - Object with default image URL and empty attribution
 */
function getDefaultImage(query = 'food') {
  // Clean up the query to get better results
  const cleanQuery = query.replace(/[^\w\s]/gi, '').trim() || 'food';
  // Use standard food categories if the query is too specific
  const foodCategory = getFoodCategory(cleanQuery);
  
  const defaultImage = {
    imageUrl: `https://source.unsplash.com/640x480/?${encodeURIComponent(foodCategory)},food,cooking`,
    smallImageUrl: `https://source.unsplash.com/320x240/?${encodeURIComponent(foodCategory)},food,cooking`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    unsplashUrl: `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
  };
  
  // Cache the default image to avoid repeated Source API calls
  imageCache.set(query, defaultImage);
  
  return defaultImage;
}

/**
 * Map specific recipe names to exact dish matches for better image results
 * @param {string} recipeName - The recipe name to categorize
 * @returns {string} - A specific dish name that will work well with Unsplash
 */
function getFoodCategory(recipeName) {
  return getFoodSearchTerm(recipeName);
}