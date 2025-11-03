const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ScraperService = require('../services/ScraperService');
const CacheService = require('../services/CacheService');
const LLMService = require('../services/LLMService');
const { ensureAuthenticated, ensureProfileCompleted } = require('../middleware/auth');

// Get personalized event suggestions
router.post('/', ensureAuthenticated, ensureProfileCompleted, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user profile
    const user = await User.findById(userId);
    if (!user || !user.zipCode) {
      return res.status(400).json({ error: 'User profile incomplete - ZIP code required' });
    }

    const { zipCode, familyMembers } = user;

    console.log(`Fetching suggestions for user ${userId}, ZIP: ${zipCode}`);

    // Step 1: Check cache for this ZIP code
    let events = [];
    const cachedData = await CacheService.getCachedEvents(zipCode);

    if (cachedData && cachedData.events) {
      console.log(`Using cached events for ZIP: ${zipCode}`);
      events = cachedData.events;
    } else {
      // Step 2: Scrape events if cache miss or stale
      console.log(`Cache miss - scraping events for ZIP: ${zipCode}`);
      events = await ScraperService.scrapeEventsByZip(zipCode);
      
      // Step 3: Update cache
      await CacheService.updateCache(zipCode, events);
    }

    if (events.length === 0) {
      return res.json({
        message: 'No events found for your area at this time',
        events: [],
        zipCode,
      });
    }

    // Step 4: Filter and rank events using LLM based on family profile
    console.log(`Filtering ${events.length} events for family profile`);
    const personalizedEvents = await LLMService.filterAndRankEvents(events, familyMembers);

    // Step 5: Sort by date
    personalizedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      message: 'Events retrieved successfully',
      events: personalizedEvents,
      zipCode,
      totalEvents: events.length,
      personalizedCount: personalizedEvents.length,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Error fetching event suggestions',
      details: error.message 
    });
  }
});

// Force refresh cache for current user's ZIP
router.post('/refresh', ensureAuthenticated, ensureProfileCompleted, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { zipCode } = user;

    console.log(`Force refreshing cache for ZIP: ${zipCode}`);

    // Clear existing cache
    await CacheService.clearCache(zipCode);

    // Scrape new events
    const events = await ScraperService.scrapeEventsByZip(zipCode);

    // Update cache
    await CacheService.updateCache(zipCode, events);

    res.json({
      message: 'Cache refreshed successfully',
      zipCode,
      eventCount: events.length,
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    res.status(500).json({ 
      error: 'Error refreshing cache',
      details: error.message 
    });
  }
});

module.exports = router;
