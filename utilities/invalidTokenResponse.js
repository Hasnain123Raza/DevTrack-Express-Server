export default function invalidTokenResponse(response) {
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
