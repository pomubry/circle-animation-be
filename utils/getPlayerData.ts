import { jsonArrayFrom } from "kysely/helpers/postgres";
import db from "../db";

// Raw queries @ db/queries/signup.sql

export default async (username: string) =>
  await db
    .selectFrom("players as p")
    .where("p.username", "=", username)
    .select([
      "p.player_id",
      "p.username",
      "p.password",
      (eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("scores as s")
            .whereRef("s.player_id", "=", "p.player_id")
            .select(["s.beatmap_id", "s.highest_combo"])
        ).as("notes"),
    ])
    .executeTakeFirst();
