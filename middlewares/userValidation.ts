import { NextFunction, Request, Response } from "express";
import { userSchema } from "../validation/userSchema";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Validate req.body
  const user = userSchema.safeParse(req.body);
  if (!user.success) {
    return res.status(400).json({
      message: "User credentials are invalid.",
      details: user.error.format(),
    });
  }

  res.locals.body = user.data;

  next();
};
