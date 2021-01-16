const articlesRouter = require('express').Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateArticleId,
  validateArticle,
} = require('../middlewares/celebrateHandlers');

articlesRouter.get('/', getArticles);
articlesRouter.post('/', validateArticle, createArticle);
articlesRouter.delete('/:_id', validateArticleId, deleteArticle);

module.exports = articlesRouter;
