import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  if (!process.env.COOKIE_NAME) {
    return res.status(400).json({
      message: `Logout failed. Environment variables are missing`,
    });
  }
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ message: "Logged out!" });
});

export default router;
