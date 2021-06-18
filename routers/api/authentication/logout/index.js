import express from "express";

import authenticatedMiddleware from "../../../../middlewares/authenticated";

const router = express.Router();

router.get("/", authenticatedMiddleware, async (request, response) => {
  if (Boolean(request.user)) request.logOut();

  response.status(200).json({ success: true });
});

export default router;
