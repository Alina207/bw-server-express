const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  url: String,
  // publication: String,
  title: String,
  author: String,
  image: String,
  // date: created_at: {type: Date, default: Date.now},
  userId: String, // {type: Schema.Types.ObjectId, ref: 'User'},
  username: String,
  date: Date
}, {
  timestamps: true
});


const Article = mongoose.model('Article', articleSchema);


module.exports = Article;
