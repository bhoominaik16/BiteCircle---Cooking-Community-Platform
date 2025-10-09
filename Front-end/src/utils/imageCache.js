// Front-end/src/utils/imageCache.js

/**
 * In-memory cache for storing Unsplash image results
 * This helps reduce API calls and stay within rate limits
 */
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 100; // Maximum number of cached items
    this.cacheDuration = 24 * 60 * 60 * 1000; // Cache items for 24 hours
  }

  /**
   * Get an image from the cache
   * @param {string} key - Cache key (recipe name)
   * @returns {Object|null} - Cached image data or null if not found/expired
   */
  get(key) {
    if (!key) return null;
    
    const normalizedKey = this.normalizeKey(key);
    const cachedItem = this.cache.get(normalizedKey);
    
    if (!cachedItem) return null;
    
    // Check if the cache item has expired
    if (Date.now() - cachedItem.timestamp > this.cacheDuration) {
      this.cache.delete(normalizedKey);
      return null;
    }
    
    console.log(`Cache hit for: ${key}`);
    return cachedItem.data;
  }

  /**
   * Store an image in the cache
   * @param {string} key - Cache key (recipe name)
   * @param {Object} data - Image data to cache
   */
  set(key, data) {
    if (!key || !data) return;
    
    const normalizedKey = this.normalizeKey(key);
    
    // Add to cache with timestamp
    this.cache.set(normalizedKey, {
      data,
      timestamp: Date.now()
    });
    
    // Prune cache if it gets too large
    if (this.cache.size > this.maxCacheSize) {
      this.prune();
    }
    
    console.log(`Cached image for: ${key}`);
  }

  /**
   * Remove old items from the cache when it gets too large
   */
  prune() {
    // Sort items by timestamp and remove oldest ones
    const items = [...this.cache.entries()];
    items.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove the oldest 20% of items
    const itemsToRemove = Math.ceil(this.maxCacheSize * 0.2);
    items.slice(0, itemsToRemove).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Normalize the cache key to handle slight variations in recipe names
   * @param {string} key - Original recipe name
   * @returns {string} - Normalized key for cache lookup
   */
  normalizeKey(key) {
    // Convert to lowercase, remove extra spaces, special chars
    return key.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Clear all items from the cache
   */
  clear() {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics for debugging
   * @returns {Object} - Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }
}

// Create and export a singleton cache instance
const imageCache = new ImageCache();
export default imageCache;