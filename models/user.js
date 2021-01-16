/* eslint-disable func-names */
/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const uniqueValidator = require('mongoose-unique-validator');
const UnauthError = require('../errors/UnauthError');

// const regex = /https?:\/\/([\/\w.-]+)/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Елизавета',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error("Неправильные почта или пароль"));
        throw new UnauthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // return Promise.reject(new Error("Неправильные почта или пароль"));
          throw new UnauthError('Неправильные почта или пароль');
        }

        return user;
      });
    });
};

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
