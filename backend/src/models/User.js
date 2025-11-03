const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ['M', 'F', 'Other', 'Prefer not to say'],
    required: false 
  }
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  zipCode: { type: String, match: /^\d{5}$/ },
  familyMembers: [familyMemberSchema],
  profileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
