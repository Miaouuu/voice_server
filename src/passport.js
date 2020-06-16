const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");

const User = require("./models/User");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      return User.findOne({ email })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              return cb(null, user, {
                message: "Logged In Successfully",
              });
            } else {
              return cb(err, false, { message: "Wrong Password" });
            }
          });
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        return User.findOne({ email })
          .then((user) => {
            if (user) {
              return cb(null, { message: "Email is already taken" });
            } else {
              let newUser = new User({
                email,
                password: hash,
              });
              newUser.save((err) => {
                if (err) throw err;
                return cb(null, { message: "Register Successfully" });
              });
            }
          })
          .catch((err) => {
            return cb(err);
          });
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    function (jwtPayload, cb) {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
