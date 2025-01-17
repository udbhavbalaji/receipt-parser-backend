import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

export default { PORT };
