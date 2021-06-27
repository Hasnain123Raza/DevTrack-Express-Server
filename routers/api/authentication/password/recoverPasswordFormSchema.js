import Joi from "joi";

import { email } from "../validationSchemas";

export default Joi.object({
  email,
});
