import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("receipts", (table) => {
    table.increments("id").primary();
    table.string("receipt_id").notNullable().unique();
    table
      .string("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("merchant_name").notNullable();
    table.string("merchant_address");
    table.string("merchant_phone");
    table.string("merchant_website");
    table.string("receipt_no");
    table.string("date").notNullable();
    table.string("time");
    table.string("currency").notNullable().defaultTo("CAD");
    table.decimal("total").checkPositive();
    table.decimal("subtotal").checkPositive();
    table.decimal("tax");
    table.string("service_charge").nullable();
    table.decimal("tip");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("receipts");
}
