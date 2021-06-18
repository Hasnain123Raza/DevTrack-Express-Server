import express from "express";

const router = express.Router();

router.get("/", async (request, response) => {
  response.status(200).json({ success: true });
});

export default router;
