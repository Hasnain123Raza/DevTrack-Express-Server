import express from "express";

import emailRouter from "./email";
import robloxRouter from "./roblox";

const router = express.Router();

router.use("/email", emailRouter);
router.use("/roblox", robloxRouter);

export default router;
