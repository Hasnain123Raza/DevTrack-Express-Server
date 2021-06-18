import express from "express";

import routers from "./routers/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routers);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`DevTrack App listening at port: ${server.address().port}`);
});
