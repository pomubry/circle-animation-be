import express from "express";
import db from "../db";
import cookieValidation from "../middlewares/cookieValidation";
import scoreSchema from "../validation/scoreSchema";

// Raw queries @ db/queries/scores.sql
const router = express.Router();

router.put("/", cookieValidation, async (req, res) => {
  // Validate req.body
  const score = scoreSchema.safeParse(req.body);
  if (!score.success) {
    return res.status(400).json({
      message: "Invalid request body.",
      details: score.error.format(),
    });
  }

  // Update score
  const { beatmap_id, highest_combo } = score.data;
  try {
    const newScore = await db
      .insertInto("scores")
      .values({
        player_id: res.locals.user.player_id,
        beatmap_id,
        highest_combo,
      })
      .onConflict((oc) =>
        oc
          .columns(["player_id", "beatmap_id"])
          .doUpdateSet({ highest_combo })
          .where("scores.highest_combo", "<", highest_combo)
      )
      .returning(["scores.beatmap_id", "scores.highest_combo"])
      .executeTakeFirst();

    if (!newScore) {
      return res.json({
        message: "No rows were updated.",
      });
    }

    return res.json(newScore);
  } catch (error) {
    return res.status(400).json({
      message: `Failed updating table.`,
      details: error,
    });
  }
});

export default router;
