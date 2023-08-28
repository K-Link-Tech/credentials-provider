import db from '../../config/db';
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { getErrorMessage, getErrorName } from '../../../errorHandler';
import { users } from '../../schema/users.schema';
import logging from '../../config/logging.config';
import { ReqParams, UpdateParams } from '../interfaces/usersRequest.interface';
import { BadUserRequestError, DatabaseRequestError } from '../../utils/errorTypes';

const NAMESPACE = "User-routes";

type event = {
    source: string
    payload: Object
};

type eventHandler = ( event: event ) => Object;

// module to fetch all or specific user(s) in db
const getUsers:eventHandler = async (event) => {
    // getting the id parameter that is in the routes, it comes in as a string
    const { id, authData } = event.payload as ReqParams; 
    // if id == null means the person is trying to get all users
    try {
        if (!id) {
            const e = new DatabaseRequestError("Missing id parameter", "401");
            throw e;
        }

        logging.info(NAMESPACE, "Fetching data from database. Type of id:", typeof(id));
        const usersRequested = (id == null) ? await db.select().from(users).catch((error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError("Database query error.", "501");
            throw e;
        }) : await db.select().from(users).where(sql`${users.id} = ${id}`).catch((error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError("Database query error.", "501");
            throw e;
        });
        // error handling in case no such user found.
        if (usersRequested.length.valueOf() === 0) {
            logging.error(NAMESPACE, "Database query failed to retrieve user(s)! User array retrieved: ", usersRequested);
            const e = new DatabaseRequestError("User(s) does not exist.", "404");
            throw e;
        }
        logging.info(NAMESPACE, "---------END OF GET USERS PROCESS---------")
        return {
            statusCode: 200,
            data: {
                message: `The following here is the data:`,
                usersData: usersRequested,
                authData: authData
            }
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const code = parseInt(getErrorName(error));
        const errorCode = (code === null) ? 500 : code; 
        return {
            statusCode: errorCode, 
            error: new Error("Get request failed.") 
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
        const deletedUser = await db.delete(users).where(eq(users.id, id)).returning().catch( (error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError("Database query error.", "501");
            throw e;
        });
        const number: number = deletedUser.length.valueOf();
        logging.debug(NAMESPACE, "length of array");
        logging.debug(NAMESPACE, "length of array", number);
        
        if (deletedUser.length.valueOf() === 0) {
            logging.error(NAMESPACE, "Database query failed to retrieve user! User array retrieved: ", deletedUser);
            const e = new DatabaseRequestError("User does not exist.", "404");
            throw e;
        }
        logging.info(NAMESPACE, "---------END OF DELETE USER PROCESS---------");
        return {
            statusCode: 200,
            data: {
                message: "The following user has been deleted from database:",
                userData : deletedUser,
                authData : authData
            }
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const code = parseInt(getErrorName(error));
        const errorCode = (code === null) ? 500 : code; 
        return {
            statusCode: errorCode, 
            error: new Error("Delete request failed!") 
        };
    }
};

// module to delete all users in db
const deleteAllUsers: eventHandler = async (event) => {   
    const { authData } = event.payload as ReqParams; 
    try {
        logging.info(NAMESPACE, "Deleting all users from database.");
        const usersDeleted = await db.delete(users).returning().catch( (error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError("Database query error.", "501");
            throw e;
        });
        if (usersDeleted.length.valueOf() === 0) {
            logging.error(NAMESPACE, "Database query failed to retrieve user! User ");
            const e = new DatabaseRequestError("User does not exist.", "404");
            throw e;
        }

        logging.info(NAMESPACE, "The following users has been deleted... \nDisplaying now... \n"); 
        logging.info(NAMESPACE, "---------END OF DELETE ALL USERS PROCESS---------")

        return {
            statusCode: 200,
            data: {
                message: "The following users has been deleted from database:",
                users : usersDeleted,
                authData : authData
            }
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const code = parseInt(getErrorName(error));
        const errorCode = (code === null) ? 500 : code; 
        return {
            statusCode: errorCode,
            error: new Error("Delete all request failed!")
        };
    }
};

const updateUser: eventHandler = async (event) => {
    const { id, body } = event.payload as ReqParams; // getting the id parameter that is in the routes, it comes in as a string
    const { name, email, password, authData } = body as UpdateParams ;

    try {
        if (!id || !email || !password || !name) {
            const e = new DatabaseRequestError("Missing id, email, password, name parameter (s)", "401");
            throw e;
        }

        if ( (name === undefined) && (password === undefined) && (password === undefined)) {
            logging.error(NAMESPACE, "Missing all parameters tp update user data! Parameters retrieved: \n", { name: name, email: email, password: password });
            const e = new BadUserRequestError("Update request body cannot be empty!", "400");
            throw e;
        }

        logging.info(NAMESPACE, "Updating user in database.");
        const originalUser = await db.select().from(users).where(eq(users.id, id)).catch((error) => {
            logging.error(NAMESPACE, "Database query failed to retrieve user!");
            const e = new DatabaseRequestError("Get request query error!", "501");
            throw e;
        });
        
        if (originalUser.length.valueOf() === 0) {
            logging.error(NAMESPACE, "Database query failed to retrieve user!");
            const e = new DatabaseRequestError("Uuid given cannot be found!", "404");
            throw e;
        }

        let updated: boolean = false;
        if (name) {
            await db.update(users).set({name: name}).where(eq(users.id, id)).catch((error) => {
                logging.error(NAMESPACE, getErrorMessage(error), error);
                const e = new DatabaseRequestError("Update database query error!", "501");
                throw e;
            });
            updated = true;
        }
        if (email) {
            await db.update(users).set({email: email}).where(eq(users.id, id)).catch((error) => {
                logging.error(NAMESPACE, getErrorMessage(error), error);
                const e = new DatabaseRequestError("Update database query error!", "501");
                throw e;
            });
            updated = true;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.update(users).set({password: hashedPassword}).where(eq(users.id, id)).catch((error) => {
                logging.error(NAMESPACE, getErrorMessage(error), error);
                const e = new DatabaseRequestError("Update database query error!", "501");
                throw e;
            });
            updated = true;
        }
        
        const updatedUser = await db.select().from(users).where(eq(users.id, id)).catch( (error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError("Get database query error!");
            e.name = "501";
            throw e;
        });

        if (updatedUser.length.valueOf() === 0) {
            logging.error(NAMESPACE, "Update process failed. Current user data in database: \n", updateUser)
            const e = new DatabaseRequestError("Update process failed please check request body parameters.", "501");
            throw e;
        }

        logging.info(NAMESPACE, "---------END OF UPDATE USER PROCESS---------");
        return {
            statusCode: 202,
            data: {
                message: "The following user has been updated in database:",
                originalUser: originalUser,
                updatedUser: updatedUser,
                authData: authData
            }
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const code = parseInt(getErrorName(error));
        const errorCode = (code === null) ? 500 : code; 
        return {
            statusCode: errorCode, 
            error: new Error("Update request failed.") 
        };
    }
};

export default {
    getUsers,
    deleteUser,
    deleteAllUsers,
    updateUser
}

