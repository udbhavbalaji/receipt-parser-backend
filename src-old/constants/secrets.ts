import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const SECRET_APP_KEY = process.env.SECRET_APP_KEY || "testing123";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_PRIVATE_SECRET = process.env.JWT_PRIVATE_SECRET || "testing123";

export default { PORT, SECRET_APP_KEY, JWT_PRIVATE_SECRET, JWT_EXPIRES_IN };
