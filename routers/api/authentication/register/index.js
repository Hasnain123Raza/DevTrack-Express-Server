import express from "express";
import bcrypt from "bcrypt";
import registerFormSchema from "./registerFormSchema";
import {
  addUser,
  checkDisplayNameDuplication,
  checkEmailDuplication,
} from "../../../../services/database/models/users";

import validateMiddlware from "../../../../middlewares/validate";

const router = express.Router();

router.post(
  "/",
  validateMiddlware(registerFormSchema),
  async (request, response) => {
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
              path: ["displayName"],
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
              path: ["email"],
              message: "Email is already associated with an existing account.",
            },
          ],
        });

      user.password = await bcrypt.hash(password, 10);

      const addedUser = await addUser(user);
      return response.status(200).json({
        success: true,
        payload: addedUser,
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
