const usersRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getUsers, getUser } = require("../controllers/users");

const validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

usersRouter.get("/", getUsers);
usersRouter.get("/me", validateUserId, getUser);

module.exports = usersRouter;
