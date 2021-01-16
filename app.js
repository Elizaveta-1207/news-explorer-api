/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { errors } = require('celebrate');

const { serverFallMessage } = require('./configs/messages');
const { limiter } = require('./configs/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT, DB_URL } = require('./configs/index');
const router = require('./routes/index');

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(serverFallMessage);
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

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
