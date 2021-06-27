import express from "express";

import authenticatedRouter from "./authenticated";
import loginRouter from "./login";
import logoutRouter from "./logout";
import registerRouter from "./register";
import passwordRouter from "./password";

const router = express.Router();

router.use("/authenticated", authenticatedRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/register", registerRouter);
router.use("/password", passwordRouter);

export default router;
