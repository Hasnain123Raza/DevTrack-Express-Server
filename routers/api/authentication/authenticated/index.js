import express from "express";

const router = express.Router();

router.get("/", async (request, response) => {
  response.status(200).json({
    success: true,
    payload: {
      authenticated: Boolean(request.user),
      user: request.user,
    },
  });
});

export default router;
