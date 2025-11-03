const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: String,
  location: String,
  description: String,
  ageHints: String,
  genderHints: String,
  link: String
});

const eventCacheSchema = new mongoose.Schema({
  zipCode: { type: String, required: true, unique: true, match: /^\d{5}$/ },
  events: [eventSchema],
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expires: 0 } }
});

eventCacheSchema.pre('save', function(next) {
  // Set expiration to 24 hours from now
  this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next();
});

module.exports = mongoose.model('EventCache', eventCacheSchema);
