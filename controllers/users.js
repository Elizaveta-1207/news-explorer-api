/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthError = require("../errors/UnauthError");
const UniqueError = require("../errors/UniqueError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError("Данные о пользователях не найдены!");
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
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        next(new UnauthError("Неверно введен id")); // сюда попадет ошибка 401
      }
      next(err); // сюда попадут ошибки 404 и 500
    });
};

// module.exports.getUserById = (req, res, next) => {
//   User.findById(req.params._id)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError("Нет пользователя с таким id");
//       } else {
//         res.send(user);
//       }
//     })
//     .catch((err) => {
//       if (err.kind === "ObjectId") {
//         next(new UnauthError("Неверно введен id")); // сюда попадет ошибка 401
//       }
//       next(err); // сюда попадут ошибки 404 и 500
//     });
// };

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // console.log(req.body.password);
  // let p = req.body.password;
  // console.log(p.length);
  if (req.body.password.length < 8) {
    throw new BadRequestError(
      "Ошибка валидации. Пароль должен состоять из 8 или более символов"
    );
  } else {
    bcrypt
      .hash(password.toString(), 10)
      .then((hash) =>
        User.create({
          email,
          password: hash,
          name,
        })
      )
      .then((newUser) => {
        if (!newUser) {
          throw new NotFoundError("Неправильно переданы данные");
        } else {
          res.send({
            // about: newUser.about,
            // avatar: newUser.avatar,
            email: newUser.email,
            name: newUser.name,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "ValidationError") {
          next(
            new BadRequestError("Ошибка валидации. Введены некорректные данные")
          );
        } else if (err.code === 11000) {
          next(new UniqueError("Данный email уже зарегистрирован"));
        }
        next(err);
      });
  }
};

// module.exports.updateUser = (req, res, next) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
//     .then((user) => {
//       res.send(user);
//     })
//     .catch(next);
// };

// module.exports.updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError("Нет пользователя с таким id");
//       } else {
//         res.send(user);
//       }
//     })
//     .catch(next);
// };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // return User.findUserByCredentials(email, password)
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // прописать ошибку!!!
      // console.log(user);
      if (!user) {
        throw new UnauthError("Авторизация не пройдена!");
      }
      const token = jwt.sign(
        { _id: user._id },
        // временно!!!
        // "super-strong-secret",
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      // что не так!!?
      res.send({ token });
    })
    .catch(next);
};
