import Joi from "joi";

export const displayName = Joi.string()
  .alphanum()
  .trim()
  .min(3)
  .max(20)
  .required()
  .messages({
    "string.empty": "Display name is required.",
    "string.alphanum":
      "Display name must only contain alpha-numeric characters.",
    "string.min": "Display name must be at least 3 characters long.",
    "string.max":
      "Display name must be less than or equal to 20 characters long.",
  });

export const email = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a correct email.",
  });

export const password = Joi.string().min(10).max(100).required().messages({
  "string.empty": "Password is required.",
  "string.min": "Password must be at least 10 characters long.",
  "string.max": "Password must be less than or equal to 100 characters long.",
});
