import { Response } from "express";
import jwt from "jsonwebtoken";
import { CookiePayload } from "../types";

export default (payload: CookiePayload, res: Response) => {
  if (
    !process.env.COOKIE_NAME ||
    !process.env.JWT_SECRET ||
    !process.env.SAME_SITE
  ) {
    return res.status(400).json({
      message: `Creating cookie failed. Environment variables are missing.`,
    });
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: true,
    sameSite: process.env.SAME_SITE as "strict" | "lax" | "none",
    signed: true,
  });
};
