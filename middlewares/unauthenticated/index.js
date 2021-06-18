export default function authenticated(request, response, next) {
  if (!Boolean(request.user)) next();
  else
    return response.status(400).json({
      success: false,
      errors: [
        {
          path: ["authenticated"],
          message: "User is already authenticated.",
        },
      ],
    });
}
