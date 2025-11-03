const EventCache = require('../models/EventCache');

class CacheService {
  /**
   * Get cached events for a ZIP code
   * @param {string} zipCode - 5-digit ZIP code
   * @returns {Promise<Object|null>} Cached events or null if not found/expired
   */
  async getCachedEvents(zipCode) {
    try {
      const cache = await EventCache.findOne({ zipCode });
      
      if (!cache) {
        console.log(`No cache found for ZIP: ${zipCode}`);
        return null;
      }

      // Check if cache is still valid (less than 24 hours old)
      const cacheAge = Date.now() - cache.timestamp.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (cacheAge > twentyFourHours) {
        console.log(`Cache expired for ZIP: ${zipCode}`);
        return null;
      }

      console.log(`Cache hit for ZIP: ${zipCode}`);
      return cache;
    } catch (error) {
      console.error('Error getting cached events:', error);
      return null;
    }
  }

  /**
   * Update cache with new events for a ZIP code
   * @param {string} zipCode - 5-digit ZIP code
   * @param {Array} events - Array of event objects
   * @returns {Promise<Object>} Updated cache object
   */
  async updateCache(zipCode, events) {
    try {
      const cache = await EventCache.findOneAndUpdate(
        { zipCode },
        {
          zipCode,
          events,
          timestamp: new Date(),
        },
        { upsert: true, new: true }
      );

      console.log(`Cache updated for ZIP: ${zipCode} with ${events.length} events`);
      return cache;
    } catch (error) {
      console.error('Error updating cache:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific ZIP code
   * @param {string} zipCode - 5-digit ZIP code
   * @returns {Promise<void>}
   */
  async clearCache(zipCode) {
    try {
      await EventCache.deleteOne({ zipCode });
      console.log(`Cache cleared for ZIP: ${zipCode}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Clear all expired caches
   * @returns {Promise<void>}
   */
  async clearExpiredCaches() {
    try {
      const result = await EventCache.deleteMany({
        timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      console.log(`Cleared ${result.deletedCount} expired caches`);
    } catch (error) {
      console.error('Error clearing expired caches:', error);
      throw error;
    }
  }
}

module.exports = new CacheService();
