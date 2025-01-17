import z from "zod";
import { messages } from "../constants";

const registerSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.string().trim().email(messages.InvalidEmailMessage),
    password: z.string().trim().min(8, messages.PasswordTooShortMessage),
  })
  .required();

export default registerSchema;
