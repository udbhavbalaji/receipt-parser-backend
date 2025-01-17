import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const SECRET_APP_KEY = process.env.SECRET_APP_KEY || "testing123";

export default { PORT, SECRET_APP_KEY };
