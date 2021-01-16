/* eslint-disable object-curly-newline */
const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  notFoundMessage,
  notFoundIdItem,
  forbiddenToDeleteItem,
} = require('../configs/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(articles);
      }
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      res.send({
        _id: article._id,
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      });
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params._id)
    .select('+owner')
    .orFail(() => {
      throw new NotFoundError(notFoundIdItem);
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenToDeleteItem);
      }
    })
    .then(() => {
      Article.findByIdAndRemove(req.params._id)
        .then((article) => {
          if (!article) {
            throw new NotFoundError(notFoundMessage);
          }
          res.send(article);
        })
        .catch(next);
    })
    .catch(next);
};
