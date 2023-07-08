const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const jwtSettings = require('../constants/jwtSetting');
const { Employee } = require('../models');

const passportConfigAdmin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: jwtSettings.ADMIN_SECRET,
  },
  async (payload, done) => {
    console.log('««««« admin »»»»»');
    try {
      const user = await Employee.findById(payload._id).select('-password');

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

const passportConfigLocalAdmin = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      console.log('««««« admin »»»»»');
      const user = await Employee.findOne({ email });

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

module.exports = {
  passportConfigAdmin,
  passportConfigLocalAdmin,
};
