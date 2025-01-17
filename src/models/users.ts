import {
  throwDatabaseManipulationError,
  throwDatabaseQueryError,
} from "../errors";
import db from "../config/database";
import { UserDB } from "../types/database";

const create = (user: UserDB) => {
  return db
    .insert(user)
    .into("users")
    .catch((err) => {
      throw throwDatabaseManipulationError(err);
    });
};

const getByEmail = (email: string, cols?: Array<keyof UserDB>) => {
  return db
    .select(cols ?? "*")
    .from("users")
    .where("email", email)
    .first()
    .catch((err) => {
      throw throwDatabaseQueryError(err);
    });
};

export default { create, getByEmail };
