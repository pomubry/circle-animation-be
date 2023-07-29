-- PUT
INSERT INTO scores (player_id, beatmap_id, highest_combo)
VALUES ($1, $2, $3)
ON CONFLICT (player_id, beatmap_id)
DO UPDATE SET highest_combo = $4 -- should be same value as $3
WHERE scores.highest_combo < $5 -- should be same value as $3
RETURNING scores.beatmap_id, scores.highest_combo;
