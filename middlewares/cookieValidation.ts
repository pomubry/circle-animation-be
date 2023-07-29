import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { CookiePayload } from "../types";

export default (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.COOKIE_NAME || !process.env.JWT_SECRET) {
    return res.status(400).json({
      message: `Environment variables are missing.`,
    });
  }

  try {
    // Check if token exists
    let cookie = req.signedCookies[process.env.COOKIE_NAME];
    if (!cookie)
      return res
        .status(401)
        .json({ message: "Cookie not found.", isAuthenticated: false });

    // Validate token
    const payload = jwt.verify(cookie, process.env.JWT_SECRET) as CookiePayload;
    res.locals.user = payload;
  } catch (error) {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.status(403).json({
      message: "Invalid token.",
      isAuthenticated: false,
      details: error,
    });
  }

  next();
};
