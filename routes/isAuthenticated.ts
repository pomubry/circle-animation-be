import express from "express";
import cookieValidation from "../middlewares/cookieValidation";

const router = express.Router();

router.post("/", cookieValidation, async (_, res) => {
  return res.json({ isAuthenticated: true });
});

export default router;
