/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// const { errors, celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

// const articlesRouter = require('./routes/articles');
// const usersRouter = require('./routes/users');
// const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const NotFoundError = require('./errors/NotFoundError');
const { serverErrorMessage, serverFallMessage } = require('./configs/messages');
const { limiter } = require('./configs/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { PORT = 3000 } = process.env;
const { PORT, DB_URL } = require('./configs/index');
const router = require('./routes/index');

const app = express();

// const validateUserLogin = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// });

// const validateUserSignup = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//     name: Joi.string().required().min(2).max(30),
//   }),
// });

app.use(cors());
app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    // throw new Error('Сервер сейчас упадёт');
    throw new Error(serverFallMessage);
  }, 0);
});

// app.post('/signin', validateUserLogin, login);
// app.post('/signup', validateUserSignup, createUser);
// app.use(auth);

// app.use('/articles', articlesRouter);
// app.use('/users', usersRouter);
// app.use('/*', (req, res) => {
//   // res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
//   throw new NotFoundError('Запрашиваемый ресурс не найден');
// });

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    message: statusCode === 500 ? serverErrorMessage : message,
  });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
