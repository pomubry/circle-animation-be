import express from "express";
import bcrypt from "bcrypt";
import userValidation from "../middlewares/userValidation";
import createJWT from "../utils/createJWT";
import getPlayerData from "../utils/getPlayerData";
import { ParsedBody, PlayerData } from "../types";

const router = express.Router();

router.post("/", userValidation, async (req, res) => {
  const { username, password } = res.locals.body as ParsedBody;

  // Check if username already exists
  let player: PlayerData | undefined;
  try {
    player = await getPlayerData(username);

    if (!player) {
      const message = `Player "${username}" does not exist.`;
      return res.status(404).json({
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

  // Check if password matched
  try {
    let matched = await bcrypt.compare(password, player.password);
    if (!matched) {
      const message = "Invalid Password";
      return res.status(401).json({
        message,
        details: { password: { __errors: [message] } },
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: `Failed to verify password.`,
      details: error,
    });
  }

  const { player_id, password: pw, ...rest } = player;

  createJWT({ player_id }, res);

  res.json(rest);
});

export default router;
