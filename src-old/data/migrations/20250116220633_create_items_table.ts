import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("items", (table) => {
    table.increments("id").primary();
    table.string("item_id").notNullable().unique();
    table
      .string("receipt_id")
      .notNullable()
      .references("receipt_id")
      .inTable("receipts")
      .onDelete("CASCADE");
    table.decimal("amount").notNullable();
    table.string("description");
    table.string("flags").nullable();
    table.integer("qty").notNullable();
    table.decimal("unit_price").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("items");
}
