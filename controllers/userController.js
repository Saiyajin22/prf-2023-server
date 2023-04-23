const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passport = require('passport');

router.route('/login').post((req, res, next) => {
  if (req.body.username, req.body.password) {
    passport.authenticate('local', function (error, user) {
      if (error) return res.status(500).send(error);
      req.login(user, function (error) {
        if (error) return res.status(500).send(error);
        return res.status(200).send('Successfully logged in!');
      })
    })(req, res);
  } else {
    return res.status(400).send('Hibas keres, username es password kell');
  }
});

router.route('/logout').post((req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).send('Successfully logged out!');
  } else {
    return res.status(403).send('User is not logged in!');
  }
})

router.route('/status').get((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user)
    return res.status(200).send(req.user);
  } else {
    return res.status(403).send('User is not logged in!');
  }
})

async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'There is no user with the given id' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    accessLevel: req.body.accessLevel,
    birthdate: req.body.birthdate,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.accessLevel != null) {
    res.user.accessLevel = req.body.accessLevel;
  }
  if (req.body.birthdate != null) {
    res.user.birthdate = req.body.birthdate;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User successfully deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router