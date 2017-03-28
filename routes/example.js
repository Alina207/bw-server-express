const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/article-model');

const router = express.Router();


  // GET http://localhost:3000/api/articles
router.get('/articles', (req, res, next) => {
  Article.find((err, articleList) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(articleList);
  });
});

  // POST http://localhost:3000/api/articles
router.post('/articles', (req, res, next) => {
  const theArticle = new Article({
    url: req.body.url,
    author: req.body.author,
    title: req.body.title,
    image: req.body.image,
    // userID: req.body.userID,
  });

  theArticle.save((err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'New clickbait added!',
      id: theArticle._id
    });
  });
});

router.get('/articles/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Article.findById(req.params.id, (err, theArticle) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(theArticle);
  });
});

router.put('/articles/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    URL: req.body.url,
    author: req.body.author,
    title: req.body.title,
    image: req.body.image,
    username: req.body.username,
  };

  Article.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Article updated successfully'
    });
  });
});

router.delete('/articles/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Article.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Article has been deleted!'
    });
  });
});


module.exports = router;
