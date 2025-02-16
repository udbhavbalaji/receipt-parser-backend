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

const getByID = (userId: string, cols?: Array<keyof UserDB>) => {
  return db
    .select(cols ?? "*")
    .from("users")
    .where({ user_id: userId })
    .first()
    .catch((err) => {
      throw throwDatabaseQueryError(err);
    });
};

const logIn = (userId: string, token: string) => {
  return db("users")
    .where("user_id", userId)
    .update({
      logged_in: "Y",
      last_generated_token: token,
    })
    .catch((err) => {
      throw throwDatabaseManipulationError(err);
    });
};

const logOut = (userId: string) => {
  return db("users")
    .where("user_id", userId)
    .update({ logged_in: "N" })
    .catch((err) => {
      throw throwDatabaseManipulationError(err);
    });
};

const deleteById = (userId: string) => {
  return db("users")
    .where("user_id", userId)
    .del()
    .catch((err) => {
      throw throwDatabaseManipulationError(err);
    });
};

export default { create, getByEmail, logIn, getByID, logOut, deleteById };
