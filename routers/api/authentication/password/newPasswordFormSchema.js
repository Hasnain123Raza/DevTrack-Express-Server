import Joi from "joi";

import { password } from "../validationSchemas.js";

export default Joi.object({
  token: Joi.string().min(61).max(61).required().messages({
    "string.empty": "Token is required.",
    "string.min": "Token must be 61 characters long.",
    "string.max": "Token must be 61 characters long.",
  }),
  password,
});
