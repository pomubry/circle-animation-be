import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("beatmaps")
    .ifNotExists()
    .addColumn("beatmap_id", "uuid", (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("song_name", sql`varchar(100)`, (col) => col.notNull())
    .addColumn("difficulty", "integer", (col) =>
      col.check(sql`difficulty >= 1`).notNull()
    )
    .addColumn("live_icon", sql`varchar(100)`, (col) => col.notNull())
    .addColumn("code", sql`varchar(10)`, (col) => col.notNull())
    .addColumn("member_category", "integer", (col) =>
      col.check(sql`member_category >= 1`).notNull()
    )
    .addColumn("star", "integer", (col) => col.check(sql`star >= 1`).notNull())

    .execute();

  await db.schema
    .createTable("rank_info")
    .ifNotExists()
    .addColumn("rank_id", "uuid", (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("beatmap_id", "uuid", (col) =>
      col.references("beatmaps.beatmap_id").onDelete("cascade").notNull()
    )
    .addColumn("rank", "integer", (col) => col.check(sql`rank >= 1`).notNull())
    .addColumn("rank_min", "integer", (col) =>
      col.check(sql`rank_min >= 0`).notNull()
    )
    .addColumn("rank_max", "integer", (col) =>
      col.check(sql`rank_max >= 0`).notNull()
    )
    .execute();

  await db.schema
    .createTable("combo_info")
    .ifNotExists()
    .addColumn("combo_id", "uuid", (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("beatmap_id", "uuid", (col) =>
      col.references("beatmaps.beatmap_id").onDelete("cascade").notNull()
    )
    .addColumn("combo", "integer", (col) =>
      col.check(sql`combo >= 1`).notNull()
    )
    .addColumn("combo_min", "integer", (col) =>
      col.check(sql`combo_min >= 0`).notNull()
    )
    .addColumn("combo_max", "integer", (col) =>
      col.check(sql`combo_max >= 0`).notNull()
    )
    .execute();

  await db.schema
    .createTable("notes")
    .ifNotExists()
    .addColumn("note_id", "uuid", (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("beatmap_id", "uuid", (col) =>
      col.references("beatmaps.beatmap_id").onDelete("cascade").notNull()
    )
    .addColumn("timing_sec", "float4", (col) =>
      col.check(sql`timing_sec >= 0`).notNull()
    )
    .addColumn("notes_attribute", "integer", (col) =>
      col.check(sql`notes_attribute >= 1 AND notes_attribute <= 3`).notNull()
    )
    .addColumn("notes_level", "integer", (col) =>
      col.check(sql`notes_level >= 1`).notNull()
    )
    .addColumn("effect", "integer", (col) =>
      col.check(sql`effect >= 1`).notNull()
    )
    .addColumn("effect_value", "float4", (col) =>
      col.check(sql`effect_value > 0`).notNull()
    )
    .addColumn("position", "integer", (col) =>
      col.check(sql`position >= 1 and position <= 9`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("notes").execute();
  await db.schema.dropTable("combo_info").execute();
  await db.schema.dropTable("rank_info").execute();
  await db.schema.dropTable("beatmaps").execute();
}
