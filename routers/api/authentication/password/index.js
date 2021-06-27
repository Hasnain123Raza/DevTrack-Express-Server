import express from "express";
import newPasswordFormSchema from "./newPasswordFormSchema";
import recoverPasswordFormSchema from "./recoverPasswordFormSchema";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { getSimplifiedUserByEmail } from "../../../../services/database/collections/users";
import {
  setPasswordToken,
  getPasswordToken,
  removePasswordToken,
  setPassword,
} from "../../../../services/database/collections/users/password";
import sendPasswordRecoverMail from "./sendPasswordRecoverMail";
import parseToken from "../../../../utilities/parseToken";

import validateMiddleware from "../../../../middlewares/validate";

const router = express.Router();

router.post(
  "/recover",
  validateMiddleware(recoverPasswordFormSchema),
  async (request, response) => {
    const { email } = request.body;

    try {
      const { _id, displayName } = await getSimplifiedUserByEmail(email);
      const { passwordToken: oldPasswordToken } = await getPasswordToken(_id);

      if (Boolean(oldPasswordToken) && Date.now() < oldPasswordToken.cooldown)
        return response.status(400).json({
          success: false,
          errors: [
            {
              path: ["alert"],
              message:
                "You need to wait a moment before another email can be sent.",
            },
          ],
        });

      const newPasswordToken = {
        value: `${_id.toString()}:${uuidv4()}`,
        cooldown: Date.now() + 1 * 60 * 1000,
        expiration: Date.now() + 15 * 60 * 1000,
      };

      await setPasswordToken(_id, newPasswordToken);

      await sendPasswordRecoverMail(displayName, email, newPasswordToken.value);

      return response.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        success: false,
        errors: [
          {
            path: ["alert"],
            message: "The server is having issues, please try again later.",
          },
        ],
      });
    }
  }
);

function invalidTokenResponse(response) {
  return response.status(400).json({
    success: false,
    errors: [
      {
        path: ["alert"],
        message: "The token is invalid.",
      },
    ],
  });
}

router.post(
  "/new",
  validateMiddleware(newPasswordFormSchema),
  async (request, response) => {
    const { token, password } = request.body;

    try {
      const { success: tokenParseSuccess, _id } = parseToken(token);
      if (!tokenParseSuccess) return invalidTokenResponse(response);

      const { passwordToken } = await getPasswordToken(_id);
      if (!Boolean(passwordToken)) return invalidTokenResponse(response);

      const { value, expiration } = passwordToken;

      if (Date.now() > expiration)
        return response.status(400).json({
          success: false,
          errors: [
            {
              path: ["alert"],
              message: "The token has expired.",
            },
          ],
        });
      if (token !== value) return invalidTokenResponse(response);

      await removePasswordToken(_id);

      const hashedPassword = await bcrypt.hash(password, 10);
      await setPassword(_id, hashedPassword);

      return response.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        success: false,
        errors: [
          {
            path: ["alert"],
            message: "The server is having issues, please try again later.",
          },
        ],
      });
    }
  }
);

export default router;
