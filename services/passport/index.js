import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getSimplifiedUserByEmail,
  getSimplifiedUserById,
} from "../database/collections/users";
import bcrypt from "bcrypt";
import mongodb from "mongodb";

const verifyCallback = async (email, password, done) => {
  try {
    const simplifiedUser = await getSimplifiedUserByEmail(email);

    if (!Boolean(simplifiedUser)) {
      return done(null, false, {
        message: "Email is invalid.",
        path: ["user", "email"],
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      simplifiedUser.password
    );
    if (!isPasswordCorrect) {
      return done(null, false, {
        message: "Password is invalid.",
        path: ["user", "password"],
      });
    }

    done(null, simplifiedUser);
  } catch (error) {
    console.log(error);
    return done(null);
  }
};

const strategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  verifyCallback
);

passport.use(strategy);

passport.serializeUser((simplifiedUser, done) => {
  done(null, simplifiedUser._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const { password, ...simplifiedUser } = await getSimplifiedUserById(
      new mongodb.ObjectID(userId)
    );
    if (Boolean(simplifiedUser)) return done(null, simplifiedUser);
    else return done(null, false);
  } catch (error) {
    console.log(error);
    return done(null);
  }
});
