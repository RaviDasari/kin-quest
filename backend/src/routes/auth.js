const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Google OAuth login
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login-failed' 
  }),
  (req, res) => {
    // Successful authentication
    const redirectUrl = req.user.profileCompleted 
      ? '/suggestions' 
      : '/profile';
    res.redirect(process.env.FRONTEND_URL + redirectUrl);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.redirect(process.env.FRONTEND_URL || '/');
  });
});

// Check auth status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileCompleted: req.user.profileCompleted,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
