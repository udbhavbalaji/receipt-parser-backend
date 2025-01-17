import { z } from "zod";
import { messages } from "../constants";

const loginSchema = z
  .object({
    email: z.string().trim().email(messages.InvalidEmailMessage),
    password: z.string().trim().min(8, messages.PasswordTooShortMessage),
  })
  .required();

export default loginSchema;
