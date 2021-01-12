/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");
const validator = require("validator");

// const regex = /https?:\/\/([\/\w.-]+)/;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // return regex.test(v);
        return validator.isURL(v);
      },
      message: "This link is not valid!", // когда validator вернёт false, будет использовано это сообщение
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // return regex.test(v);
        return validator.isURL(v);
      },
      message: "This link is not valid!", // когда validator вернёт false, будет использовано это сообщение
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model("article", articleSchema);
