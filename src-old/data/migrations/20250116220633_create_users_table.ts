import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("user_id").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("password").notNullable().checkLength(">", 8);
    table.enum("logged_in", ["Y", "N"]).defaultTo("N");
    table.string("last_generated_token").nullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
