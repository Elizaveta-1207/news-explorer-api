/* eslint-disable no-unused-vars */
const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundMessage } = require('../configs/messages');

const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserSignup, createUser);
router.use(auth);

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);
router.use('/*', (req, res, next) => {
  // res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
  // throw new NotFoundError('Запрашиваемый ресурс не найден');
  throw new NotFoundError(notFoundMessage);
});

module.exports = router;
