import z from "zod";
import { messages } from "../constants";

const RegisterRequestSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.string().trim().email(messages.error.InvalidEmail),
    password: z.string().trim().min(8, messages.error.PasswordTooShort),
  })
  .required();

export default RegisterRequestSchema;
