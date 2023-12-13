import { getErrorMessage, getErrorName } from "../../utils/errorHandler";
import logging from "../../config/logging.config";
import { ReqParams, UpdateParams } from "../interfaces/usersRequest.interface";
import {
  BadUserRequestError,
  DatabaseRequestError,
} from "../../utils/errorTypes";
import {
  deletedAllUsers,
  deletedOneUser,
  getAllUsers,
  getOneUser,
  isUserUpdated,
} from "../lib/db_query/user";

const NAMESPACE = "User-routes";

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

// module to fetch all or specific user(s) in db
const getUsers: eventHandler = async (event) => {
  // getting the id parameter that is in the routes, it comes in as a string
  const { id, authData } = event.payload as ReqParams;
  // if id == null means the person is trying to get all users
  try {
    const usersRequested =
      id == null ? await getAllUsers() : await getOneUser(id);
    logging.info(NAMESPACE, "---------END OF GET USERS PROCESS---------");
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        usersData: usersRequested,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error("Get request failed."),
    };
  }
};

// module to delete a specific user in db
const deleteUser: eventHandler = async (event) => {
  const { id, authData } = event.payload as ReqParams; // getting the id parameter that is in the routes, it comes in as a string

  try {
    if (!id) {
      const e = new DatabaseRequestError("Missing id parameter", "401");
      throw e;
    }
    logging.info(NAMESPACE, "Deleting user from database.");
    const deletedUser = await deletedOneUser(id);

    logging.info(
      NAMESPACE,
      "The following user has been deleted... \n",
      deleteUser
    );
    logging.info(NAMESPACE, "---------END OF DELETE USER PROCESS---------");
    return {
      statusCode: 200,
      data: {
        message: "The following user has been deleted from database:",
        userData: deletedUser,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error("Delete request failed!"),
    };
  }
};

// module to delete all users in db
const deleteAllUsers: eventHandler = async (event) => {
  const { authData } = event.payload as ReqParams;
  try {
    logging.info(NAMESPACE, "Deleting ALL users from database.");
    const usersDeleted = await deletedAllUsers();

    logging.info(
      NAMESPACE,
      "The following users has been deleted... \n",
      usersDeleted
    );
    logging.info(
      NAMESPACE,
      "---------END OF DELETE ALL USERS PROCESS---------"
    );

    return {
      statusCode: 200,
      data: {
        message: "The following users has been deleted from database:",
        users: usersDeleted,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error("Delete all request failed!"),
    };
  }
};

const updateUser: eventHandler = async (event) => {
  const { id, body } = event.payload as ReqParams; // getting the id parameter that is in the routes, it comes in as a string
  const { name, email, password, authData } = body as UpdateParams;

  try {
    if (!id) {
      const e = new DatabaseRequestError("Missing id parameter", "401");
      throw e;
    }

    if (name === undefined && email === undefined && password === undefined) {
      logging.error(
        NAMESPACE,
        "Missing all parameters to update user data! Parameters retrieved: \n",
        { name: name, email: email, password: password }
      );
      const e = new BadUserRequestError(
        "Update request body cannot be empty!",
        "400"
      );
      throw e;
    }

    logging.info(NAMESPACE, "Updating user in database.");
    const originalUser = await getOneUser(id);
    let hasUpdated = isUserUpdated(id, name, email, password);
    if (!hasUpdated) {
      logging.error(
        NAMESPACE,
        "No parameters were updated, update request failed. Printing hasUpdated: ",
        hasUpdated
      );
      const e = new DatabaseRequestError(
        "Update request failed after running database update query.",
        "500"
      );
      throw e;
    }

    const updatedUser = await getOneUser(id);
    logging.info(NAMESPACE, "---------END OF UPDATE USER PROCESS---------");
    return {
      statusCode: 202,
      data: {
        message: "The following user has been updated in database:",
        originalUser: originalUser,
        updatedUser: updatedUser,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error("Update request failed."),
    };
  }
};

export default {
  getUsers,
  deleteUser,
  deleteAllUsers,
  updateUser,
};
