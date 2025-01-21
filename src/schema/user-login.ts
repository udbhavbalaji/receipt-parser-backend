import { z } from "zod";
import { messages } from "../constants";

const UserLoginSchema = z
  .object({
    email: z.string().trim().email(messages.error.InvalidEmail),
    password: z.string().trim().min(8, messages.error.PasswordTooShort),
  })
  .required();

export default UserLoginSchema;
