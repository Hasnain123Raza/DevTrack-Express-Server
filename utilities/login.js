import passport from "passport";

export default async function login(request, response, next) {
  const { email, password } = request.body.user;
  request.body = { email: email.toLowerCase(), password };

  passport.authenticate("local", (error, user, info) => {
    if (error) {
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
    if (!user)
      return response.status(400).json({ success: false, errors: [info] });

    request.logIn(user, (error) => {
      if (error) {
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
      } else return response.status(200).json({ success: true });
    });
  })(request, response, next);
}
