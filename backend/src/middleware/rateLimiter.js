const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits to 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict limiter for authentication endpoints
 * Limits to 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Limiter for profile updates
 * Limits to 10 requests per 15 minutes per IP
 */
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many profile update requests, please try again later.',
});

/**
 * Limiter for suggestions endpoint
 * Limits to 30 requests per 15 minutes per IP
 */
const suggestionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many suggestions requests, please try again later.',
});

/**
 * Limiter for scraping/refresh operations
 * Limits to 5 requests per hour per IP
 */
const scrapeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many refresh requests, please try again later.',
});

module.exports = {
  apiLimiter,
  authLimiter,
  profileLimiter,
  suggestionsLimiter,
  scrapeLimiter,
};
