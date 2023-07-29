import express from "express";
import db from "../db";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { beatmapSchema } from "../validation/beatmapSchema";
import beatmapQuerySchema from "../validation/beatmapQuerySchema";

// Raw queries @ db/queries/beatmaps.sql
const router = express.Router();

router.get("/", async (req, res) => {
  const queries = beatmapQuerySchema.safeParse(req.query);

  try {
    let query = db
      .selectFrom("beatmaps")
      .innerJoin("notes", "beatmaps.beatmap_id", "notes.beatmap_id");

    if (queries.success) {
      const { dif, att, grp } = queries.data;

      if (dif) {
        query = query.where("beatmaps.difficulty", "=", dif);
      }

      if (att) {
        query = query.where("notes.notes_attribute", "=", att);
      }

      if (grp) {
        query = query.where("beatmaps.member_category", "=", grp);
      }
    }

    const beatmaps = await query
      .groupBy(["beatmaps.beatmap_id", "notes.notes_attribute"])
      .select((eb) => [
        "beatmaps.beatmap_id",
        "beatmaps.code",
        "beatmaps.song_name",
        "beatmaps.difficulty",
        "beatmaps.member_category",
        "notes.notes_attribute",
        jsonArrayFrom(
          eb
            .selectFrom("notes")
            .select(["notes.note_id", "notes.timing_sec", "notes.position"])
            .whereRef("beatmaps.beatmap_id", "=", "notes.beatmap_id")
            .orderBy("notes.timing_sec", "asc")
        ).as("notes"),
        jsonArrayFrom(
          eb
            .selectFrom("combo_info")
            .select([
              "combo_info.combo_id",
              "combo_info.combo",
              "combo_info.combo_min",
              "combo_info.combo_max",
            ])
            .whereRef("beatmaps.beatmap_id", "=", "combo_info.beatmap_id")
        ).as("combos"),
      ])
      .execute();
    return res.json(beatmaps);
  } catch (error) {
    return res.json({
      message: "Failed to fetch all beatmaps.",
      details: error,
    });
  }
});

router.post("/", async (req, res) => {
  const beatmap = beatmapSchema.safeParse(req.body);

  if (!beatmap.success) {
    return res.status(400).json({
      message: "Invalid beatmap schema.",
      details: beatmap.error.format(),
    });
  }

  const {
    code,
    difficulty,
    live_icon,
    song_name,
    song_info,
    rank_info,
    combo_info,
  } = beatmap.data;
  const { member_category, star, notes } = song_info[0];
  let id: string | undefined;

  try {
    const result = await db
      .insertInto("beatmaps")
      .values({
        code,
        difficulty,
        live_icon,
        song_name,
        member_category,
        star,
      })
      .returning(["beatmap_id"])
      .execute();
    const beatmap_id = result[0].beatmap_id;
    id = beatmap_id;

    await db
      .insertInto("rank_info")
      .values(
        rank_info.map((rank) => ({
          beatmap_id,
          ...rank,
        }))
      )
      .execute();

    await db
      .insertInto("combo_info")
      .values(
        combo_info.map((combo) => ({
          beatmap_id,
          ...combo,
        }))
      )
      .execute();

    await db
      .insertInto("notes")
      .values(
        notes.map((note) => ({
          beatmap_id,
          ...note,
        }))
      )
      .execute();

    return res.status(201).json({
      message: `Successfully saved "${song_name}" with difficulty ${difficulty} and id "${id}".`,
    });
  } catch (error) {
    try {
      if (id) {
        // foreign keys have ON DELETE CASCADE
        await db.deleteFrom("beatmaps").where("beatmap_id", "=", id).execute();
      }
      return res.status(400).json({
        message: `Failed to save "${song_name}" with difficulty ${difficulty}.`,
        details: error,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Failed to remove beatmap with id "${id}". Please remove it manually in the database.`,
        details: err,
      });
    }
  }
});

export default router;
