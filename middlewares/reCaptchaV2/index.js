import fetch from "node-fetch";

import dotenv from "dotenv";
dotenv.config();

export default async function reCaptchaV2(request, response, next) {
  const { reCaptchaToken, ...payload } = request.body;

  const googleResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_V2_SECRET_KEY}&response=${reCaptchaToken}`,
    {
      method: "POST",
    }
  );

  const googleData = await googleResponse.json();
  const { success } = googleData;
  if (!success)
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["reCaptcha"],
          message: "There was a problem with ReCaptcha. Please try again.",
        },
      ],
    });

  request.body = payload;
  next();
}
