const articlesRouter = require('express').Router();
// const { celebrate, Joi, CelebrateError } = require('celebrate');
// const validator = require('validator');

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateArticleId,
  validateArticle,
} = require('../middlewares/celebrateHandlers');

// const { notValidLink } = require('../configs/messages');

// const validateArticleId = celebrate({
//   params: Joi.object().keys({
//     _id: Joi.string().alphanum().length(24).hex(),
//   }),
// });

// const validateArticle = celebrate({
//   body: Joi.object().keys({
//     keyword: Joi.string().required(),
//     title: Joi.string().required(),
//     text: Joi.string().required(),
//     date: Joi.string().required(),
//     source: Joi.string().required(),
//     link: Joi.string()
//       .required()
//       .custom((url) => {
//         if (!validator.isURL(url)) {
//           throw new CelebrateError(notValidLink);
//         }
//         return url;
//       }),
//     image: Joi.string()
//       .required()
//       .custom((url) => {
//         if (!validator.isURL(url)) {
//           throw new CelebrateError(notValidLink);
//         }
//         return url;
//       }),
//   }),
// });

articlesRouter.get('/', getArticles);
articlesRouter.post('/', validateArticle, createArticle);
articlesRouter.delete('/:_id', validateArticleId, deleteArticle);

module.exports = articlesRouter;
