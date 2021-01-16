/* eslint-disable comma-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthError = require('../errors/UnauthError');
const UniqueError = require('../errors/UniqueError');

const {
  notFoundMessage,
  notFoundIdUser,
  badRequestMessage,
  notUniqueEmail,
  wrongEmailOrPsw,
} = require('../configs/messages');

const { JWT_SECRET } = require('../configs/index');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(users);
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  // для /:_id
  // User.findById(req.params._id)
  // для /me
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundIdUser);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password.toString(), 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((newUser) => {
      if (!newUser) {
        throw new BadRequestError(badRequestMessage);
      } else {
        res.send({
          email: newUser.email,
          name: newUser.name,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else if (err.code === 11000) {
        next(new UniqueError(notUniqueEmail));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthError(wrongEmailOrPsw);
      }
      const token = jwt.sign(
        { _id: user._id },

        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch(next);
};
