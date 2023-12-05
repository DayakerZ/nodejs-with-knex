import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.uuid("user_id").unsigned().notNullable();
    table.foreign("user_id").references("id").inTable("users");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("posts");
}
