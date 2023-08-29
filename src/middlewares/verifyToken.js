const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const HTTPError = require('../errors/httpError');

const verifyToken = (req, _, next) => {
  const { token } = req.session;

  if (!token) {
    throw new HTTPError('No token provided', 403);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new HTTPError('Unauthorized', 401);
    }

    req.accountID = decoded.accountID;
    next();
  });
};

module.exports = { verifyToken };
