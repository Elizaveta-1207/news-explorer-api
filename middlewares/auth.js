/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnauthError = require('../errors/UnauthError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const { unauthMessage } = require('../configs/messages');
const { JWT_SECRET } = require('../configs/index');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthError(unauthMessage));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthError(unauthMessage));
  }

  req.user = payload;

  next();
};
