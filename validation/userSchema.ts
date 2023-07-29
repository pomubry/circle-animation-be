import { z } from "zod";

export const userSchema = z.object({
  username: z.string().max(30),
  password: z.string().min(6),
});
