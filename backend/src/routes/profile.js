const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');
const { isValidZipCode, isValidGender, isValidDOB } = require('../utils/validation');
const { profileLimiter } = require('../middleware/rateLimiter');

// Get user profile
router.get('/', ensureAuthenticated, profileLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      zipCode: user.zipCode,
      familyMembers: user.familyMembers,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Create/Update user profile
router.post('/', ensureAuthenticated, profileLimiter, async (req, res) => {
  try {
    const { zipCode, familyMembers } = req.body;

    // Validate ZIP code
    if (!zipCode || !isValidZipCode(zipCode)) {
      return res.status(400).json({ error: 'Invalid ZIP code - must be 5 digits' });
    }

    // Validate family members
    if (!familyMembers || !Array.isArray(familyMembers) || familyMembers.length === 0) {
      return res.status(400).json({ error: 'At least one family member is required' });
    }

    // Validate each family member
    for (const member of familyMembers) {
      if (!member.name || !member.dob) {
        return res.status(400).json({ 
          error: 'Each family member must have a name and date of birth' 
        });
      }

      // Validate date of birth
      if (!isValidDOB(member.dob)) {
        return res.status(400).json({ 
          error: `Invalid date of birth for ${member.name}` 
        });
      }

      // Validate gender if provided
      if (!isValidGender(member.gender)) {
        return res.status(400).json({ 
          error: 'Invalid gender value' 
        });
      }
    }

    // Update user profile
    const user = await User.findById(req.user._id);
    user.zipCode = zipCode;
    user.familyMembers = familyMembers;
    user.profileCompleted = true;
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        email: user.email,
        zipCode: user.zipCode,
        familyMembers: user.familyMembers,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Update profile (PUT method for updates)
router.put('/', ensureAuthenticated, profileLimiter, async (req, res) => {
  try {
    const { zipCode, familyMembers } = req.body;

    const updateData = {};
    
    if (zipCode) {
      if (!isValidZipCode(zipCode)) {
        return res.status(400).json({ error: 'Invalid ZIP code - must be 5 digits' });
      }
      updateData.zipCode = zipCode;
    }

    if (familyMembers) {
      if (!Array.isArray(familyMembers) || familyMembers.length === 0) {
        return res.status(400).json({ error: 'At least one family member is required' });
      }
      updateData.familyMembers = familyMembers;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        email: user.email,
        zipCode: user.zipCode,
        familyMembers: user.familyMembers,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;
