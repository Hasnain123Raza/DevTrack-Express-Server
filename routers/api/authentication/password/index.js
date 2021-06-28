import express from "express";
import newPasswordFormSchema from "./newPasswordFormSchema";
import recoverPasswordFormSchema from "./recoverPasswordFormSchema";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { getSimplifiedUserByEmail } from "../../../../services/database/collections/users";
import { setPassword } from "../../../../services/database/collections/users";
import {
  getToken,
  setToken,
  removeToken,
} from "../../../../services/database/collections/users/token";
import sendPasswordRecoverMail from "./sendPasswordRecoverMail";
import parseToken from "../../../../utilities/token/parseToken";
import invalidTokenResponse from "../../../../utilities/token/invalidTokenResponse";
import canRequestToken from "../../../../utilities/token/canRequestToken";

import validateMiddleware from "../../../../middlewares/validate";

const router = express.Router();

router.post(
  "/recover",
  validateMiddleware(recoverPasswordFormSchema),
  async (request, response) => {
    const { email } = request.body;

    try {
      const { _id, displayName } = await getSimplifiedUserByEmail(email);

      if (!canRequestToken(_id, "passwordToken"))
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

      await setToken(_id, "passwordToken", newPasswordToken);

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

router.post(
  "/new",
  validateMiddleware(newPasswordFormSchema),
  async (request, response) => {
    const { token, password } = request.body;

    try {
      const { success: tokenParseSuccess, _id } = parseToken(token);
      if (!tokenParseSuccess) return invalidTokenResponse(response);

      const { passwordToken } = await getToken(_id, "passwordToken");
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

      await removeToken(_id, "passwordToken");

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
