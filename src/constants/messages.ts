// ERRORS MESSAGES
const InvalidEmail = "Invalid email. Enter a valid email to register.";

const PasswordTooShort = "Your password must be at least 8 characters long.";
const MissingSecretAppKeyError =
  "Your app is not verified. Contact the devs to get access.";
const InvalidSecretAppKeyError = "Invalid app key";
const InvalidCredentialsError =
  "Invalid email and/or password. Please check your credentials and try again";
const JSONParseError =
  "Request body has a syntax error and couldn't be processed";
const JWTMissing = "JWT is missing";
const JWTInvalid = "JWT is invalid";
const UpdatedJWT = "Updated JWT found";
const JWTExpired = "JWT expired";
const JWTMalformed = "JWT malformed";
const JWTError = "Something went wrong while verifying JWT.";
const DefaultError = "Something went wrong :(";
const ZodError = "Request body data is invalid. Check all fields and try again";
const PropertyStyleError = "Error transforming property styles";

// SUCCESS MESSAGES

// INFO MESSAGES
const LogOut = "User logged out. Delete Jwt immediately";
const UserAlreadyExists = "User already exists";
const UserAlreadyLoggedIn = "User already logged in";
const UserNotFound = "User not found";
const UserAlreadyLoggedOut = "User already logged out";
const UserLogOutInstruction = "User logged out. Delete Jwt immediately";
const ReceiptNotFound = "Receipt not found";

// WARN MESSAGES
const AuthHandlerMalfunction =
  "Auth Handler didn't work properly, Jwt malformed";

// generate error messages for all errors in my project below

const error = {
  InvalidEmail,
  PasswordTooShort,
  MissingSecretAppKeyError,
  InvalidSecretAppKeyError,
  InvalidCredentialsError,
  JSONParseError,
  JWTMissing,
  JWTInvalid,
  UpdatedJWT,
  JWTExpired,
  JWTMalformed,
  JWTError,
  DefaultError,
  ZodError,
  PropertyStyleError,
};

const info = {
  ReceiptNotFound,
  LogOut,
  UserAlreadyExists,
  UserAlreadyLoggedIn,
  UserNotFound,
  UserAlreadyLoggedOut,
  UserLogOutInstruction,
};

const warn = {
  AuthHandlerMalfunction,
};

export default { error, info, warn };

// export {
//   UserAlreadyLoggedIn,
//   UserLogOutInstruction,
//   UpdatedJWT,
//   UserNotFound,
//   UserAlreadyLoggedOut,
//   JWTInvalid,
//   JWTMissing,
//   UserAlreadyExists,
//   InvalidEmail,
//   PasswordTooShort,
//   MissingSecretAppKeyError,
//   InvalidSecretAppKeyError,
//   InvalidCredentialsError,
//   LogOut,
//   DefaultError,
//   JSONParseError,
//   AuthHandlerMalfunction,
//   PropertyStyleError,
//   ZodError,
//   JWTError,
//   JWTExpired,
//   JWTMalformed,
// };
