import express from "express";

import timeRouter from "./time";

const router = express.Router();

router.use("/time", timeRouter);

export default router;
