const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// this is the route where the signup form get's posted to
router.post('/signup', (req, res, next) => {
  // get username and password
  const { username, password } = req.body;
  console.log({ username, password });
  // is the password at least 8 chars
  if (password.length < 8) {
    // if not we show the signup form again with a message
    res.render('signup', { message: 'Your password has to be 8 chars min' });
    return
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return
  }
  // validation passed - password is long enough and the username is not empty
  // check if the username already exists
  User.findOne({ username: username })
    .then(userFromDB => {
      // if user exists -> we render signup again
      if (userFromDB !== null) {
        res.render('signup', { message: 'This username is already taken' });
      } else {
        // the username is available
        // we create the hashed password
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        console.log(hash);
        // create the user in the database
        User.create({ username: username, password: hash })
          .then(createdUser => {
            console.log(createdUser);
            res.redirect('/');
          })
      }
    })
});


module.exports = router;