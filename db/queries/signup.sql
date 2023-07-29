-- GET
SELECT p.player_id, p.username, p.password,
    (
        SELECT COALESCE(json_agg(score_table),'[]')
        FROM (
            SELECT s.beatmap_id, s.highest_combo
            FROM scores s
            WHERE s.player_id = p.player_id
        ) AS score_table
    ) AS notes
FROM players p
WHERE p.username = $1;

-- POST
INSERT INTO players (username,password)
VALUES ($1,$2);