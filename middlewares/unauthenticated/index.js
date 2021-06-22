export default function authenticated(request, response, next) {
  const { user } = request;
  if (!Boolean(user)) next();
  else
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["authenticated"],
          message: "User is already authenticated.",
        },
      ],
      payload: { authenticated: Boolean(user), user: user },
    });
}
