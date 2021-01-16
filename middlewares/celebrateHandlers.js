const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const { notValidLink } = require('../configs/messages');

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

const validateArticleId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError(notValidLink);
        }
        return url;
      }),
    image: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError(notValidLink);
        }
        return url;
      }),
  }),
});

module.exports = {
  validateUserLogin,
  validateUserSignup,
  validateArticleId,
  validateArticle,
};
