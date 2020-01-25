const jwt = require('jsonwebtoken');
const config = require('config');

// middleware function to verify token

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // If token is not valid
  if (!token) {
    return res.status(401).json({ msg: 'No token.!! Authorization Denied' });
  }

  // Verify Token
  try {
    const decoded = jwt.decode(token, config.get('jwtSecretToken'));

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
