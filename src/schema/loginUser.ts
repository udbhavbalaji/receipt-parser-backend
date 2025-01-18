import { z } from "zod";
import { messages } from "../constants";

const loginSchema = z
  .object({
    email: z.string().trim().email(messages.error.InvalidEmail),
    password: z.string().trim().min(8, messages.error.PasswordTooShort),
  })
  .required();

export default loginSchema;
