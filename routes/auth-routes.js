const express  = require('express');
const passport = require('passport');
const bcrypt   = require('bcrypt');

const User     = require('../models/user-model');

const authRoutes = express.Router();

// ------------ SIGNUP ------------ //
authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const email    = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password.' });
    return;
  }

  User.findOne({ email }, '_id', (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong.' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'The username already exists.' });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser  = new User({
      username,
      email,
      encryptedPassword: hashPass,
    });

    theUser.save((err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
          return;
        }

        res.status(200).json(req.user);
      });
    });
  });
});

// ------------ LOGIN ------------ //
authRoutes.post('/login', (req, res, next) => {
  const passportFunction = passport.authenticate('local',
    (err, theUser, failureDetails) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
          return;
        }

        res.status(200).json(req.user);
      });
    }
  );

  passportFunction(req, res, next);
});


// ------------ LOGOUT ------------ //
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success.' });
});

// ------------ LOGGED IN ------------ //
authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(401).json({ message: 'Unauthorized.' });
});

function gtfoIfNotLogged (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'FORBIDDEN.' });
    return;
  }

  next();
}


// ------------ PRIVATE ONLY ------------ //
authRoutes.get('/private', gtfoIfNotLogged, (req, res, next) => {
  res.json({ message: 'You have to be logged in to see that.' });
});


module.exports = authRoutes;
