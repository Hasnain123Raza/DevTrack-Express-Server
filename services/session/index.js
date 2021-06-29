import session from "express-session";
import MongoStore from "connect-mongo";

import dotenv from "dotenv";
dotenv.config();

const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGODB_CONNECTION_STRING,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DATABASE_NAME,
  },
  collection: "sessions",
});

export default session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "none",
    secure: true,
    httpOnly: true,
  },
});
