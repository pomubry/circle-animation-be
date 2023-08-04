import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("scores")
    .ifNotExists()
    .addColumn("beatmap_id", "uuid", (col) =>
      col.references("beatmaps.beatmap_id").onDelete("cascade").notNull()
    )
    .addColumn("player_id", "uuid", (col) =>
      col.references("players.player_id").onDelete("cascade").notNull()
    )
    .addColumn("highest_combo", "integer", (col) =>
      col.check(sql`highest_combo >= 1 and highest_combo <= 2000`).notNull()
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz")
    .addPrimaryKeyConstraint("one_beatmap_record_per_player", [
      "beatmap_id",
      "player_id",
    ])
    .execute();

  await sql`
    DROP TRIGGER IF EXISTS update_score_ts_trigger
    ON scores`.execute(db);

  await sql`
    CREATE TRIGGER update_score_ts_trigger
    BEFORE UPDATE
    on scores
    FOR EACH ROW
    EXECUTE PROCEDURE update_ts_func();`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("scores").execute();
}
