import Joi from "joi";

import { displayName, email, password } from "../validationSchemas.js";

const userSchema = Joi.object({
  displayName,
  email,
  password,
});

export default Joi.object({
  user: userSchema,
});
