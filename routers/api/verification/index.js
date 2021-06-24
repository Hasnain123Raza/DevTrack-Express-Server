import express from "express";

import emailRouter from "./email";

const router = express.Router();

router.use("/email", emailRouter);

export default router;
