import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("players")
    .ifNotExists()
    .addColumn("player_id", "uuid", (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("username", sql`varchar(30)`, (col) => col.unique().notNull())
    .addColumn("password", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz")
    .execute();

  await sql`
    CREATE OR REPLACE FUNCTION update_ts_func()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS
    $$
    BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
            NEW.updated_at = now();
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
    END;
    $$;`.execute(db);

  await sql`
    DROP TRIGGER IF EXISTS update_player_ts_trigger
    ON players`.execute(db);

  await sql`
    CREATE TRIGGER update_player_ts_trigger
    BEFORE UPDATE
    on players
    FOR EACH ROW
    EXECUTE PROCEDURE update_ts_func();`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("players").execute();
}
