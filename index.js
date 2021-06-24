import express from "express";
import cors from "cors";
import session from "./services/session";
import passport from "passport";

import "./services/database";
import "./services/passport";
import "./services/mail";

import routers from "./routers/index.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routers);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`DevTrack App listening at port: ${server.address().port}`);
});
