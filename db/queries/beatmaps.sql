-- GET
SELECT
	b.beatmap_id,
	b.song_name,
	b.difficulty,
	b.member_category,
	n.notes_attribute,
	(
		SELECT jsonb_agg(note_table)
		FROM (
			SELECT note_id, timing_sec, position
			FROM notes
			where notes.beatmap_id = b.beatmap_id
		) AS note_table
	) AS notes,
	(
		SELECT jsonb_agg(combo_table)
		FROM (
			SELECT combo_id, combo, combo_min, combo_max
			FROM combo_info
			where combo_info.beatmap_id = b.beatmap_id
		) AS combo_table
	) AS combos
	-- alternatively, use this
	-- jsonb_agg(
	-- to_jsonb(n) - 'effect' - 'notes_level' - 'beatmap_id' - 'effect_value' - 'notes_attribute') AS notes
FROM
	beatmaps b
inner join notes n 
      ON
	b.beatmap_id = n.beatmap_id
GROUP BY
	b.beatmap_id,
	n.notes_attribute;

-- POST
INSERT INTO beatmaps
    (song_name,difficulty,live_icon,code,member_category,star,__v)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING beatmap_id;

INSERT INTO rank_info
	(beatmap_id,rank,rank_min,rank_max)
	VALUES ($1,$2,$3,$4);

INSERT INTO notes
	(beatmap_id,timing_sec,notes_attribute,notes_level,effect,effect_value,position)
	VALUES ($1,$2,$3,$4,$5,$6,$7);

-- DELETE
DELETE FROM beatmaps WHERE beatmap_id = $1;
