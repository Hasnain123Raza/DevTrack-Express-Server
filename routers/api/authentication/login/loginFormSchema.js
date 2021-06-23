import Joi from "joi";

import { email, password, reCaptchaToken } from "../validationSchemas.js";

const userSchema = Joi.object({
  email,
  password,
});

export default Joi.object({
  user: userSchema,
  reCaptchaToken,
});
