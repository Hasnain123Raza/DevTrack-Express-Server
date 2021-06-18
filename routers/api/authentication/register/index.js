import express from "express";
import login from "../../../../utilities/login";
import bcrypt from "bcrypt";
import registerFormSchema from "./registerFormSchema";
import {
  addUser,
  checkDisplayNameDuplication,
  checkEmailDuplication,
} from "../../../../services/database/models/users";

import unauthenticatedMiddleware from "../../../../middlewares/unauthenticated";
import validateMiddlware from "../../../../middlewares/validate";

const router = express.Router();

router.post(
  "/",
  unauthenticatedMiddleware,
  validateMiddlware(registerFormSchema),
  async (request, response, next) => {
    const { user } = request.body;
    user.email = user.email.toLowerCase();

    const { displayName, email, password } = user;

    try {
      const displayNameDuplication = await checkDisplayNameDuplication(
        displayName
      );
      if (displayNameDuplication)
        return response.status(400).json({
          success: false,
          errors: [
            {
              path: ["user", "displayName"],
              message: "Display name is already taken.",
            },
          ],
        });

      const emailDuplication = await checkEmailDuplication(email);
      if (emailDuplication)
        return response.status(400).json({
          success: false,
          errors: [
            {
              path: ["user", "email"],
              message: "Email is already associated with an existing account.",
            },
          ],
        });

      const hashedPassword = await bcrypt.hash(password, 10);
      const dbUser = {
        displayName,
        email,
        password: hashedPassword,
      };
      const addedUser = await addUser(dbUser);

      return await login(request, response, next);
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
