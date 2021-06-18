import express from "express";

import accountRouter from "./account";
import authenticationRouter from "./authentication";
import miscellaneousRouter from "./miscellaneous";
import trackRouter from "./track";

const router = express.Router();

router.use("/account", accountRouter);
router.use("/authentication", authenticationRouter);
router.use("/miscellaneous", miscellaneousRouter);
router.use("/track", trackRouter);

export default router;
