import db from '../config/db';
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Request, Response, } from 'express';
import userType from '../interfaces/user.interface';
import errorMessage from '../../../../errorHandler';
import { users } from '../schema/users.schema';
import logging from '../config/logging.config';
import User from '../interfaces/user.interface';

const NAMESPACE = "User-routes";

type handlerInput = {
    source: string,
    payload: any
}

// module to fetch all or specific user(s) in db
const getUsers = async (event: handlerInput) => {
    const id: string = event.payload; // getting the id parameter that is in the routes, it comes in as a string
    // if id == null means the person is trying to get all users
    try {
        logging.info(NAMESPACE, "Fetching data from database.");
        const usersRequested = (id == null) ? await db.select().from(users) : await db.select().from(users).where(sql`${users.id} = ${id}`).catch( (error) => {
            logging.error(NAMESPACE, "Uuid given cannot be found!", error);
            return {
                statusCode: 404, 
                message: "User does not exist."
            };
        });
        logging.info(NAMESPACE, "Data has been fetched... \nDisplaying now... \n"); // ask why does this still run even when the callback has been called above for uuids that don't exist.
        logging.info(NAMESPACE, "---------END OF GET USERS PROCESS---------")

        return {
            statusCode: 200,
            message: "Here are the user(s):",
            data : usersRequested,
        };
    } catch (error) {
        logging.error(NAMESPACE, "Get request failed!\n", error);
        return {
            statusCode: 500, 
            message: errorMessage(error),
            error: error 
        };
    }
};

// module to delete a specific user in db
const deleteUser = async (req: Request, res: Response) => {
    const id: string = req.params.id; // getting the id parameter that is in the routes, it comes in as a string
    
    try {
        logging.info(NAMESPACE, "Deleting user from database.");
        const deletedUser = await db.delete(users).where(eq(users.id, id)).returning().catch( (error) => {
            logging.error(NAMESPACE, "Uuid given cannot be found!", error);
            return res.status(404).json({ message: "User does not exist."});
        });

        if (deletedUser) {
            logging.info(NAMESPACE, "The following user has been deleted... \nDisplaying now... \n"); 
            logging.info(NAMESPACE, "", deletedUser);
            logging.info(NAMESPACE, "---------END OF DELETE USER PROCESS---------");

            return res.status(200).json({
                message: "The following user has been deleted from database:",
                user : deletedUser,
                payload : res.locals.verified
            });
        }
    } catch (error) {
        logging.error(NAMESPACE, "Delete user request failed!\n", error);
        return res.status(500).json({ 
            message: errorMessage(error),
            error: error 
        });
    }
};

const deleteAllUsers = async (req: Request, res: Response) => {    
    try {
        logging.info(NAMESPACE, "Deleting all users from database.");
        const usersDeleted = (await db.delete(users).returning());

        if (usersDeleted) {
            logging.info(NAMESPACE, "The following users has been deleted... \nDisplaying now... \n"); 
            logging.info(NAMESPACE, "---------END OF DELETE ALL USERS PROCESS---------")

            return res.status(200).json({
                message: "The following users has been deleted from database:",
                users : usersDeleted,
                payload : res.locals.verified
            });
        }
    } catch (error) {
        logging.error(NAMESPACE, "Delete all request failed!\n", error);
        return res.status(500).json({ 
            message: errorMessage(error),
            error: error 
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const id: string = req.params.id; // getting the id parameter that is in the routes, it comes in as a string
    let { name, email, password } = req.body;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Update request body cannot be empty!"
        });
    }

    try {
        logging.info(NAMESPACE, "Updating user in database.");
        const originalUser = await db.select().from(users).where(eq(users.id, id)).catch( (error) => {
            logging.error(NAMESPACE, "Uuid given cannot be found!", error);
            return res.status(404).json({ message: "User does not exist."});
        });
        let updated: boolean = false;
        if (name) {
            await db.update(users).set({name: name}).where(eq(users.id, id));
            updated = true;
        }
        if (email) {
            await db.update(users).set({email: email}).where(eq(users.id, id));
            updated = true;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.update(users).set({password: hashedPassword}).where(eq(users.id, id));
            updated = true;
        }
        
        const updatedUser = await db.select().from(users).where(eq(users.id, id)).catch( (error) => {
            logging.error(NAMESPACE, "Uuid given cannot be found!", error);
            return res.status(404).json({ message: "User does not exist."});
        });

        if (updated) {
            logging.info(NAMESPACE, "The following user has been updated... \nDisplaying now... \n"); 
            logging.info(NAMESPACE, "", updatedUser);
            logging.info(NAMESPACE, "---------END OF UPDATE USER PROCESS---------");

            return res.status(200).json({
                message: "The following user has been updated in database:",
                originalUser: originalUser,
                updatedUser: updatedUser,
                payload: res.locals.verified
            });
        } else {
            return res.status(501).json({
                message: "The update process has failed for the user below, please check request body parameters.",
                originalUser: originalUser,
                updatedUser: updatedUser,
                payload: res.locals.verified
            });
        }
    } catch (error) {
        logging.error(NAMESPACE, "Update user request failed!\n", error);
        return res.status(500).json({ 
            message: errorMessage(error),
            error: error 
        });
    }
};

export default {
    getUsers,
    deleteUser,
    deleteAllUsers,
    updateUser
}

