import express from "express";
import canRequestToken from "../../../../utilities/token/canRequestToken";
import { validate as uuidValidate, v4 as uuidv4 } from "uuid";
import {
  setROBLOXUserId,
  removeROBLOXUserId,
} from "../../../../services/database/collections/users";
import {
  getToken,
  setToken,
  removeToken,
} from "../../../../services/database/collections/users/token";
import fetch from "node-fetch";
import invalidTokenResponse from "../../../../utilities/token/invalidTokenResponse";

import authenticatedMiddleware from "../../../../middlewares/authenticated";

const router = express.Router();

router.get("/", authenticatedMiddleware, async (request, response) => {
  const { _id, robloxUserId } = request.user;

  if (Boolean(robloxUserId))
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["alert"],
          message:
            "This DevTrack account already has a ROBLOX account associated with it",
        },
      ],
    });

  try {
    if (!(await canRequestToken(_id, "robloxToken")))
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

    const newRobloxToken = {
      value: `${uuidv4()}`,
      cooldown: Date.now() + 1 * 60 * 1000,
      expiration: Date.now() + 15 * 60 * 1000,
    };

    await setToken(_id, "robloxToken", newRobloxToken);

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

router.get("/unlink", authenticatedMiddleware, async (request, response) => {
  const { _id, robloxUserId } = request.user;
  if (!Boolean(robloxUserId))
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["alert"],
          message: "There is no ROBLOX account to unlink.",
        },
      ],
    });

  try {
    await removeROBLOXUserId(_id);

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

router.get(
  "/:robloxUserId",
  authenticatedMiddleware,
  async (request, response) => {
    const { robloxUserId } = request.params;

    if (Boolean(request.user.robloxUserId))
      return response.status(400).json({
        success: false,
        errors: [
          {
            path: ["alert"],
            message:
              "This DevTrack account already has a ROBLOX account associated with it",
          },
        ],
      });

    const { _id } = request.user;

    try {
      const robloxResponse = await fetch(
        `https://users.roblox.com/v1/users/${robloxUserId}`
      );
      const { description: token } = await robloxResponse.json();

      if (!uuidValidate(token)) return invalidTokenResponse(response);

      const { robloxToken } = await getToken(_id, "robloxToken");
      if (!Boolean(robloxToken)) return invalidTokenResponse(response);

      const { value, expiration } = robloxToken;
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

      await removeToken(_id, "robloxToken");

      await setROBLOXUserId(_id, robloxUserId);

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
