const rateLimit = require('express-rate-limit');
const { tooManyRequests } = require('./messages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100,
  message: tooManyRequests,
});

module.exports = { limiter };
