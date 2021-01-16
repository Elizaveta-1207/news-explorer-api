/* eslint-disable no-unused-vars */
const { serverErrorMessage } = require('../configs/messages');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? serverErrorMessage : message,
  });
};

module.exports = { errorHandler };
