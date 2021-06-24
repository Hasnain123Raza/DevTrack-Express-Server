import express from "express";

import accountRouter from "./account";
import authenticationRouter from "./authentication";
import miscellaneousRouter from "./miscellaneous";
import trackRouter from "./track";
import verificationRouter from "./verification";

const router = express.Router();

router.use("/account", accountRouter);
router.use("/authentication", authenticationRouter);
router.use("/miscellaneous", miscellaneousRouter);
router.use("/track", trackRouter);
router.use("/verification", verificationRouter);

export default router;
