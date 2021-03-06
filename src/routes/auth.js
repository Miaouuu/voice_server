const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/login", (req, res, next) => {
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
        const token = jwt.sign(user.toJSON(), "your_jwt_secret");
        return res.json({
          user: { _id: user._id, email: user.email, servers: user.servers },
          token,
        });
      });
    }
  )(req, res);
});

router.post("/register", (req, res, next) => {
  passport.authenticate("local-register", { session: false }, (err, info) => {
    console.log(err);
    if (err) {
      return res.status(400).json({
        message: info ? info.message : "Register failed",
      });
    }
    return res.json({ message: info.message });
  })(req, res);
});

module.exports = router;
