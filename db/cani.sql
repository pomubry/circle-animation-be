CREATE TABLE beatmaps (
    beatmap_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    song_name VARCHAR(100) NOT NULL,
    difficulty INT check(difficulty >= 1) NOT NULL,
    live_icon VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    member_category INT check(member_category >= 1) NOT NULL,
    star INT check(star >= 1) NOT NULL,
);

CREATE TABLE rank_info (
    rank_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    beatmap_id uuid REFERENCES beatmaps (beatmap_id) ON DELETE CASCADE NOT NULL,
    rank INT check(rank >= 1) NOT NULL,
    rank_min INT check(rank_min >= 0) NOT NULL,
    rank_max INT check(rank_max >= 0) NOT NULL
);

CREATE TABLE combo_info (
    combo_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    beatmap_id uuid REFERENCES beatmaps (beatmap_id) ON DELETE CASCADE NOT NULL,
    combo INT check(combo >= 1) NOT NULL,
    combo_min INT check(combo_min >= 0) NOT NULL,
    combo_max INT check(combo_max >= 0) NOT NULL
);

CREATE TABLE notes (
    note_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    beatmap_id uuid REFERENCES beatmaps (beatmap_id) ON DELETE CASCADE NOT NULL,
    timing_sec FLOAT check(timing_sec >= 0) NOT NULL,
    notes_attribute INT check(notes_attribute >= 1 AND notes_attribute <=3) NOT NULL,
    notes_level INT check(notes_level >= 1) NOT NULL,
    effect INT check(effect >= 1) NOT NULL,
    effect_value FLOAT check(effect_value > 0) NOT NULL,
    position INT check(position >= 1 and position <= 9) NOT NULL
);

CREATE TABLE players (
    player_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE scores (
    beatmap_id uuid REFERENCES beatmaps (beatmap_id) ON DELETE CASCADE NOT NULL,
    player_id uuid REFERENCES players (player_id) ON DELETE CASCADE NOT NULL,
    highest_combo INT check (highest_combo >= 1 and highest_combo <= 2000) NOT NULL,
    PRIMARY KEY (beatmap_id, player_id)
);