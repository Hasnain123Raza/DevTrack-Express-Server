import express from "express";
import login from "../../../../utilities/login";
import loginFormSchema from "./loginFormSchema";

import unauthenticatedMiddleware from "../../../../middlewares/unauthenticated";
import validateMiddleware from "../../../../middlewares/validate";
import reCaptchaV2Middleware from "../../../../middlewares/reCaptchaV2";

const router = express.Router();

router.post(
  "/",
  unauthenticatedMiddleware,
  validateMiddleware(loginFormSchema),
  reCaptchaV2Middleware,
  async (request, response, next) => await login(request, response, next)
);

export default router;
