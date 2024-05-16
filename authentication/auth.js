const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserTable = require('../entity/UserTable');
const User = require('../model/UserModel.js');

const { generateAccessToken } = require('../authentication/jwtAuth.js');

require('dotenv').config();

const authClientWeb = new passport.Passport();
const authAdminWeb = new passport.Passport();

authClientWeb.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL.replace(
        '<PORT>',
        process.env.PORT,
      ),
      passReqToCallback: true,
    },
    asyncHandler(
      async function (request, accessToken, refreshToken, profile, done) {
        try {
          const existingUser = await User.findOne({
            googleId: profile.id,
            accountType: UserTable.TYPE_GOOGLE,
          });

          if (existingUser === null) {
            const user = await User.create({
              googleId: profile.id,
              name: profile.name,
              email: profile.email,
              avatar: profile.avatar,
              accountType: UserTable.TYPE_GOOGLE,
              gender: null,
              role: UserTable.ROLE_USER,
            });

            const userData = {
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              gender: user.gender,
              birth: user.birth,
              role: user.role,
              _id: user._id,
            };
            const refreshToken = jwt.sign(
              userData,
              process.env.REFRESH_TOKEN_SECRET,
            );
            const userRespone = {
              user: userData,
              refreshToken: refreshToken,
              accessToken: generateAccessToken(userData),
            };
            done(null, userRespone);
          } else {
            const userData = {
              name: existingUser.name,
              email: existingUser.email,
              avatar: existingUser.avatar,
              gender: existingUser.gender,
              birth: existingUser.birth,
              role: existingUser.role,
              _id: existingUser._id,
            };
            const accessToken = generateAccessToken(userData);
            const refreshToken = jwt.sign(
              userData,
              process.env.REFRESH_TOKEN_SECRET,
            );
            await User.updateOne(
              { _id: existingUser._id },
              { $set: { refreshToken: refreshToken } },
            );
            const userResponse = {
              user: userData,
              refreshToken: refreshToken,
              accessToken: accessToken,
            };
            await done(null, userResponse);
          }
        } catch (Exception) {
          done(null, false);
        }
      },
    ),
  ),
);

authClientWeb.use(
  UserTable.ROLE_USER,
  new LocalStrategy(
    asyncHandler(async function (email, password, done) {
      try {
        const existingUser = await User.findOne({
          email: email,
          accountType: UserTable.TYPE_LOCAL_ACCOUNT,
        });
        const isTheSamePassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (existingUser && isTheSamePassword) {
          const userData = {
            name: existingUser.name,
            gender: existingUser.gender,
            birth: existingUser.birth,
            avatar: existingUser.avatar,
            role: existingUser.role,
            _id: existingUser._id,
            email: existingUser.email,
          };
          const refreshToken = jwt.sign(
            userData,
            process.env.REFRESH_TOKEN_SECRET,
          );
          await User.updateOne(
            { _id: existingUser._id },
            { $set: { refreshToken: refreshToken } },
          );
          const userRespone = {
            user: userData,
            refreshToken: refreshToken,
            accessToken: generateAccessToken(userData),
          };
          return done(null, userRespone);
        } else return done(null, false);
      } catch (e) {
        return done(null, false);
      }
    }),
  ),
);

authAdminWeb.use(
  UserTable.ROLE_ADMIN,
  new LocalStrategy(
    asyncHandler(async function (email, password, done) {
      try {
        const existingUser = await User.findOne({
          email: email,
          accountType: UserTable.TYPE_LOCAL_ACCOUNT,
          role: UserTable.ROLE_ADMIN,
        });
        const isTheSamePassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (existingUser && isTheSamePassword) {
          const userData = {
            name: existingUser.name,
            gender: existingUser.gender,
            birth: existingUser.birth,
            avatar: existingUser.avatar,
            role: existingUser.role,
            _id: existingUser._id,
            email: existingUser.email,
          };
          const refreshToken = jwt.sign(
            userData,
            process.env.REFRESH_TOKEN_SECRET,
          );
          await User.updateOne(
            { _id: existingUser._id },
            { $set: { refreshToken: refreshToken } },
          );
          const userResponse = {
            user: userData,
            refreshToken: refreshToken,
            accessToken: generateAccessToken(userData),
          };
          return done(null, userResponse);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(null, false);
      }
    }),
  ),
);

authClientWeb.serializeUser((user, done) => {
  done(null, user);
});
authClientWeb.deserializeUser((user, done) => {
  console.log(user);
  done(null, user);
});
authAdminWeb.serializeUser((user, done) => {
  done(null, user);
});
authAdminWeb.deserializeUser((user, done) => {
  done(null, user);
});
module.exports = { authClientWeb, authAdminWeb };
