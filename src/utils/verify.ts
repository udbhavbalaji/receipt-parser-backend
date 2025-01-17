import bcrypt from "bcrypt";
import { messages } from "src/constants";
import { throwBadRequestError } from "src/errors";
import { SpentAPIExceptionCodes } from "src/types/enums";

const password = (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed).catch((err) => {
    throw throwBadRequestError(
      messages.InvalidCredentialsErrorMessage,
      SpentAPIExceptionCodes.INVALID_PASSWORD
    );
  });
};

export default { password };
