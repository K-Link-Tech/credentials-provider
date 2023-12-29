import bcrypt from "bcrypt";
import db from "../../../config/db";
import { users } from "../../../schema";
import logging from "../../../config/logging.config";
import { getErrorMessage } from "../../../utils/errorHandler";
import { DatabaseRequestError } from "../../../utils/errorTypes";
import { eq, sql } from "drizzle-orm";

const NAMESPACE = "DB_QUERY";

export const getAllUsers = async () => {
  const allUsers = await db
    .select()
    .from(users)
    .catch((error) => {
      logging.error(NAMESPACE, getErrorMessage(error), error);
      const e = new DatabaseRequestError("Database query error.", "501");
      throw e;
    });

  if (allUsers.length.valueOf() === 0) {
    logging.error(
      NAMESPACE,
      "Database query failed to retrieve user(s)! Users array retrieved: ",
      allUsers
    );
    const e = new DatabaseRequestError("User(s) do not exist!", "404");
    throw e;
  }

  return allUsers;
};

export const getOneUser = async (Uid: string) => {
  const oneUser = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${Uid}`)
    .catch((error) => {
      logging.error(NAMESPACE, getErrorMessage(error), error);
      const e = new DatabaseRequestError("Database query error.", "501");
      throw e;
    });
  if (oneUser.length.valueOf() === 0) {
    logging.error(
      NAMESPACE,
      "Database query failed to retrieve user! User array retrieved: ",
      oneUser
    );
    const e = new DatabaseRequestError("User not found!", "404");
    throw e;
  }
  return oneUser;
};

export const deletedAllUsers = async () => {
  const deletedUsers = await db
    .delete(users)
    .returning()
    .catch((error) => {
      logging.error(NAMESPACE, getErrorMessage(error), error);
      const e = new DatabaseRequestError("Database query error.", "501");
      throw e;
    });
  if (deletedUsers.length.valueOf() === 0) {
    logging.error(
      NAMESPACE,
      "Database query failed to delete users! User array retrieved: ",
      deletedUsers
    );
    const e = new DatabaseRequestError("No users exist.", "404");
    throw e;
  }
  return deletedUsers;
};

export const deletedOneUser = async (Uid: string) => {
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, Uid))
    .returning()
    .catch((error) => {
      logging.error(NAMESPACE, getErrorMessage(error), error);
      const e = new DatabaseRequestError("Database query error.", "501");
      throw e;
    });
  if (deletedUser.length.valueOf() === 0) {
    logging.error(
      NAMESPACE,
      "Database query failed to delete user! User array retrieved: ",
      deletedUser
    );
    const e = new DatabaseRequestError("User does not exist.", "404");
    throw e;
  }
  return deletedUser;
};

export const isUserUpdated = async (
  Uid: string,
  name?: string,
  email?: string,
  password?: string
) => {
  let hasUpdated: boolean = false;
  if (name) {
    await db
      .update(users)
      .set({ name: name, updatedAt: new Date() })
      .where(eq(users.id, Uid))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          "Update database query error!",
          "501"
        );
        throw e;
      });
    hasUpdated = true;
  }
  if (email) {
    await db
      .update(users)
      .set({ email: email, updatedAt: new Date() })
      .where(eq(users.id, Uid))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          "Update database query error!",
          "501"
        );
        throw e;
      });
    hasUpdated = true;
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, Uid))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          "Update database query error!",
          "501"
        );
        throw e;
      });
    hasUpdated = true;
  }
  return hasUpdated;
};
