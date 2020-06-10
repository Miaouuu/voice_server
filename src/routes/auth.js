const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

router.post("/login", function (req, res, next) {
  passport.authenticate(
    "local-login",
    { session: false },
    (err, user, info) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Login failed",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign(user, "your_jwt_secret");
        return res.json({ user, token });
      });
    }
  )(req, res);
});

router.post("/register", function (req, res, next) {
  passport.authenticate(
    "local-register",
    { session: false },
    (err, user, info) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Register failed",
        });
      }
      let newUser = new User({ email: user.email, password: user.password });
      console.log(newUser);
      newUser.save(function (err) {
        if (err) throw err;
        return res.json({ message: info.message });
      });
    }
  )(req, res);
});

module.exports = router;
