/* eslint-disable no-unused-vars */
const router = require('express').Router();

const {
  validateUserLogin,
  validateUserSignup,
} = require('../middlewares/celebrateHandlers');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundMessage } = require('../configs/messages');

const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserSignup, createUser);
router.use(auth);

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);
router.use('/*', (req, res, next) => {
  throw new NotFoundError(notFoundMessage);
});

module.exports = router;
