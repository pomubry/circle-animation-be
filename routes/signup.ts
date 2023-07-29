import express from "express";
import bcrypt from "bcrypt";
import db from "../db";
import userValidation from "../middlewares/userValidation";
import createJWT from "../utils/createJWT";
import getPlayerData from "../utils/getPlayerData";
import { ParsedBody } from "../types";

const router = express.Router();

router.post("/", userValidation, async (req, res) => {
  const { username, password } = res.locals.body as ParsedBody;

  // Check if username already exists
  try {
    const player = await getPlayerData(username);

    if (player) {
      const message = `Username "${player.username}" already exists.`;
      return res.status(400).json({
        message,
        details: { username: { __errors: [message] } },
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: `Failed to check database for existing username.`,
      details: error,
    });
  }

  // Hash password
  let hash = "";
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(400).json({
      message: `Failed to encrypt password.`,
      details: error,
    });
  }

  // Save user to database
  let payload:
    | {
        player_id: string;
        username: string;
      }
    | undefined;
  try {
    const insertedPlayer = await db
      .insertInto("players")
      .values({ username, password: hash })
      .returning(["player_id", "username"])
      .executeTakeFirst();

    if (!insertedPlayer) {
      throw "Insert failed.";
    }

    payload = insertedPlayer;
  } catch (error) {
    return res.status(400).json({
      message: `Failed creating user "${username}".`,
      details: error,
    });
  }

  // Fetch player data
  try {
    const player = await getPlayerData(payload.username);

    if (!player) {
      return res.status(404).json({
        message: `Player ${payload.username} was not found.`,
      });
    }

    const { player_id, password, ...rest } = player;

    createJWT({ player_id }, res);

    return res.status(201).json(rest);
  } catch (error) {
    return res.status(400).json({
      message: `Failed fetching player data.`,
      details: error,
    });
  }
});

export default router;
