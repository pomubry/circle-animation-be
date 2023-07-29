import { z } from "zod";
import getPlayerData from "../utils/getPlayerData";
import { userSchema } from "../validation/userSchema";

export interface CookiePayload {
  player_id: string;
}

export type ParsedBody = z.infer<typeof userSchema>;

export type PlayerData = Awaited<ReturnType<typeof getPlayerData>>;
