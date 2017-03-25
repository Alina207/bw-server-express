const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const articleSchema = new Schema({
  URL: String,
  author: String,
  title: String,
}, {
  timestamps: true
});


const User = mongoose.model('Article', articleSchema);


module.exports = Article;
