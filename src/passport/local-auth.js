const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
const Reclutador = require('../models/reclutadorModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (user) {
        return done(null, false, 'Email already exists');
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, 'User not Found');
      }
      if (!user.comparePassword(password)) {
        return done(null, false, 'Incorrect password');
      }
      done(null, user);
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        let user = await User.findOne({ email: email });
        if (!user) {
          user = await Reclutador.findOne({ email: email });

          if (!user) {
            return done(null, false, {
              message: 'Incorrect email or password',
            });
          }

          const match = user.comparePassword(password);
          if (!match) {
            return done(null, false, {
              message: 'Incorrect email or password',
            });
          } else {
            return done(null, user);
          }
        }
        const match = user.comparePassword(password);
        if (!match) {
          return done(null, false, {
            message: 'Incorrect email or password',
          });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
