import express from "express";
import { getSimplifiedUserById } from "../../../../services/database/collections/users";
import { setEmailVerified } from "../../../../services/database/collections/users";
import {
  getToken,
  setToken,
  removeToken,
} from "../../../../services/database/collections/users/token";
import { v4 as uuidv4 } from "uuid";
import sendEmailVerificationMail from "./sendEmailVerificationMail";
import parseToken from "../../../../utilities/parseToken";
import invalidTokenResponse from "../../../../utilities/invalidTokenResponse";

import authenticatedMiddleware from "../../../../middlewares/authenticated";

const router = express.Router();

router.get("/", authenticatedMiddleware, async (request, response) => {
  const { _id, displayName, email, role } = request.user;

  if (role !== "unverified")
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["alert"],
          message: "The email on this account is already verified.",
        },
      ],
    });

  try {
    const { emailVerificationToken: oldEmailVerificationToken } =
      await getToken(_id, "emailVerificationToken");

    if (
      Boolean(oldEmailVerificationToken) &&
      Date.now() < oldEmailVerificationToken.cooldown
    )
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

    const newEmailVerificationToken = {
      value: `${_id.toString()}:${uuidv4()}`,
      cooldown: Date.now() + 1 * 60 * 1000,
      expiration: Date.now() + 15 * 60 * 1000,
    };

    await setToken(_id, "emailVerificationToken", newEmailVerificationToken);

    await sendEmailVerificationMail(
      displayName,
      email,
      newEmailVerificationToken.value
    );

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
});

router.get("/:token", async (request, response) => {
  const { token } = request.params;

  try {
    const { success: tokenParseSuccess, _id } = parseToken(token);
    if (!tokenParseSuccess) return invalidTokenResponse(response);

    const user = await getSimplifiedUserById(_id);
    if (user.role !== "unverified")
      return response.status(400).json({
        success: false,
        payload: {
          alreadyVerified: true,
        },
        errors: [
          {
            path: ["alert"],
            message: "The email on this account is already verified.",
          },
        ],
      });

    const { emailVerificationToken } = await getToken(
      _id,
      "emailVerificationToken"
    );
    if (!Boolean(emailVerificationToken)) return invalidTokenResponse(response);

    const { value, expiration } = emailVerificationToken;
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

    await removeToken(_id, "emailVerificationToken");

    await setEmailVerified(_id);

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
});

export default router;
