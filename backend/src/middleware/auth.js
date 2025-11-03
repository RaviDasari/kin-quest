/**
 * Middleware to check if user is authenticated
 */
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized - Please log in' });
};

/**
 * Middleware to check if user has completed profile
 */
const ensureProfileCompleted = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.profileCompleted) {
    return next();
  }
  res.status(403).json({ 
    error: 'Profile not completed',
    profileCompleted: false 
  });
};

module.exports = {
  ensureAuthenticated,
  ensureProfileCompleted,
};
