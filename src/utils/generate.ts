import * as jwt from "jsonwebtoken";
import { secrets } from "src/constants";

const userID = (initials: string): string => {
  const userIdLength = 18;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  let userId = "SU";

  for (let i = 2; i < userIdLength; i++) {
    if (i < 8) {
      userId += digits.charAt(Math.random() * digits.length);
    } else if (i <= 12 && i >= 8) {
      userId += letters.charAt(Math.random() * letters.length);
    } else if (i <= 16 && i >= 13) {
      userId += digits.charAt(Math.random() * digits.length);
    }
  }
  userId += initials;
  return userId;
};

const JWToken = (userId: string): string => {
  return jwt.sign({ userId }, secrets.JWT_PRIVATE_SECRET, {
    expiresIn: secrets.JWT_EXPIRES_IN,
  });
};

export default { userID, JWToken };
