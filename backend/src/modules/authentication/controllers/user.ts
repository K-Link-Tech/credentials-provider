import db from '../config/db';
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { NextFunction, Request, Response, } from 'express';
import { signJWT } from '../utils/signJWT';
import userType from '../interfaces/user.interface';
import errorMessage from '../../../../errorHandler';
import { users } from '../schema/users.schema';
import logging from '../config/logging.config';

const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user is authorized.");

    return res.status(200).json({
        message: "Authorized user.",
        access_Payload: res.locals.accessPayload,
        refresh_Payload: res.locals.refreshPayload
    });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    let { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        logging.info(NAMESPACE,"Password hashed!");
        await db.insert(users).values({ 
            name: name,
            email: email,
            password: hashedPassword
        }).catch( (error) => {
            logging.error(NAMESPACE,error.message, error);
            return res.status(403).json({ message: "User already exist." })
        }); // Return 403 error if exist record, else carry on.
        logging.info(NAMESPACE, "Data has been sent to database.");
        logging.info(NAMESPACE, "Data displayed.");        
        return res.status(201).json({users: req.body});
    } catch (error) {
        return res.status(500).get(errorMessage(error));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    try {
        logging.info(NAMESPACE, "Login info received.");
        const usersInDB = await db.select().from(users).where(eq(users.email,email));
        logging.info(NAMESPACE, "Users info retrieved from database.");
        if (usersInDB.length == 0)
        return res.status(401).json({error: "Email is incorrect or not registered."});
        
        bcrypt.compare(password, usersInDB[0].password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: "Incorrect password!",
                });
            } else if (result) {
                signJWT(usersInDB[0], "sign refresh token", (_error, refreshToken) => {
                    if (_error) {
                        return res.status(401).json({
                            message: "JWT refresh token signing failed!",
                            error
                        });
                    } else if (refreshToken) {
                        logging.info(NAMESPACE, "Refresh token signed and stored in locals.");
                        res.locals.refreshToken = refreshToken;
                    }
                });
                signJWT(usersInDB[0], "sign access token", (_error, accessToken) => {
                    if (_error) {
                        return res.status(401).json({
                            message: "JWT access token signing failed!",
                            error
                        });
                    } else if (accessToken) {
                        const refreshToken = res.locals.refreshToken;
                        return res.status(200).json({
                            message: "Both tokens authentication successful.",
                            access_Token: accessToken,
                            refresh_Token: refreshToken,
                            userType: usersInDB[0] 
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: errorMessage(error),
            error
        })
    }
};

// module to fetch all or specific user(s) in db
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id; // getting the id parameter that is in the routes, it comes in as a string
    // if id == null means the person is trying to get all users
    try {
        logging.info(NAMESPACE, "Fetching data from database.");
        const usersRequested = (id == null) ? await db.select().from(users) : await db.select().from(users).where(sql`${users.id} = ${id}`).catch( (error) => {
            logging.error(NAMESPACE, "Uuid given cannot be found!", error);
            return res.status(404).json({ message: "User does not exist."});
        });
        logging.info(NAMESPACE, "Data has been fetched... \nDisplaying now: \n"); // ask why does this still run even when the callback has been called above for uuids that don't exist.
        return res.status(200).json({
            users : usersRequested,
            payload : res.locals.verified
        });
    } catch (error) {
        logging.error(NAMESPACE, "Get request failed!\n", error);
        return res.status(500).json({ 
            message: errorMessage(error),
            error 
        });
    }
};


export default {
    validateToken,
    register,
    loginUser,
    getUsers
}

