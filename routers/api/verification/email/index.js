import express from "express";
import {
  getSimplifiedUserById,
  getEmailVerificationToken,
  setEmailVerificationToken,
  removeEmailVerificationToken,
  setEmailVerified,
} from "../../../../services/database/collections/users";
import { validate as uuidValidate, v4 as uuidv4 } from "uuid";
import sendEmailVerificationMail from "./sendEmailVerificationMail";
import mongodb from "mongodb";

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
      await getEmailVerificationToken(_id);

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

    await setEmailVerificationToken(_id, newEmailVerificationToken);

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

router.get("/:token", async (request, response) => {
  const { token } = request.params;

  try {
    const splitted = token.split(":");
    if (splitted.length !== 2) return invalidTokenResponse(response);

    const _idPart = splitted[0];
    if (_idPart.length !== 24) return invalidTokenResponse(response);

    const uuidPart = splitted[1];
    if (!uuidValidate(uuidPart)) return invalidTokenResponse(response);

    const _id = new mongodb.ObjectId(_idPart);
    const { emailVerificationToken } = await getEmailVerificationToken(_id);
    if (!Boolean(emailVerificationToken)) return invalidTokenResponse(response);

    const user = await getSimplifiedUserById(_id);
    if (user.role !== "unverified")
      return response.status(400).json({
        success: false,
        errors: [
          {
            path: ["alert"],
            message: "The email on this account is already verified.",
          },
        ],
      });

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

    await removeEmailVerificationToken(_id);

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
