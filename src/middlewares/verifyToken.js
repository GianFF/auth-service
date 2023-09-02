const jwt = require('jsonwebtoken');
const { AUTH_TOKEN } = require('../config');
const HTTPError = require('../errors/httpError');

const verifyToken = (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new HTTPError('No auth header provided', 401);
  }
  const authToken = authHeader.split(' ')[1];
  jwt.verify(authToken, AUTH_TOKEN, (error, decoded) => {
    if (error) {
      throw new HTTPError('Unauthorized', 403);
    }
    req.accountID = decoded.accountID;
  });
  next();
};

module.exports = { verifyToken };
