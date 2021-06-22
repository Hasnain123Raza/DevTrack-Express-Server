export default function authenticated(request, response, next) {
  const { user } = request;
  if (Boolean(user)) next();
  else
    return response.status(403).json({
      success: false,
      errors: [
        {
          path: ["unauthenticated"],
          message: "User is not authenticated to perform this action.",
        },
      ],
    });
}
