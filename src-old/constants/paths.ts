import path from "path";

const knexDB = path.resolve(__dirname, "../data/receipts.db");
const knexMigrations = path.resolve(__dirname, "../data/migrations");

export default { knexDB, knexMigrations };
