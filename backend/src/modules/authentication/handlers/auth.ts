import db from '../config/db';
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { NextFunction, Request, Response, } from 'express';
import { signJWT } from '../utils/JWT-helpers';
import userType from '../interfaces/user.interface';
import errorMessage from '../../../../errorHandler';
import { users } from '../schema/users.schema';
import { LoginReq } from '../interfaces/authRequest.interface';
import logging from '../config/logging.config';
import User from '../interfaces/user.interface';

const NAMESPACE = "Auth-route";

type event = {
    source: string
    payload: Object
};

type eventHandler = ( event: event ) => Object;

const refreshAccessToken = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, "Refresh token validated, user is authorized.");
    const { id } = res.locals.refreshPayload;
    try {
        const userRequested =  await db.select().from(users).where(sql`${users.id} = ${id}`)
        if (userRequested.length == 0) {
            logging.error(NAMESPACE, "Uuid given cannot be found!", new Error("Uuid does not exist in database."));
            return res.status(404).json({ message: "User does not exist."});
        }
        signJWT(userRequested[0], "accessPrivateKey", (_error, payload) => {
            if (_error) {
                return res.status(401).json({
                    message: "JWT access token signing failed!",
                    error: _error
                });
            } else if (payload) {
                logging.info(NAMESPACE, "---------END OF ACCESS TOKEN REFRESH PROCESS---------");
                return res.status(200).json({
                    message: "Refreshing of accessToken successful.",
                    accessSigningPayload: payload,
                    userType: userRequested[0]
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: errorMessage(error),
            error: error
        });
    }
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user is authorized.");
    logging.info(NAMESPACE, "---------END OF TOKEN VALIDATION PROCESS---------");

    return res.status(200).json({
        message: "Authorized user.",
        access_Payload: res.locals.accessPayload,
        refresh_Payload: res.locals.refreshPayload
    });
};

const register = async (req: Request, res: Response) => {
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
        logging.info(NAMESPACE, "---------END OF REGISTRATION PROCESS---------")     
        return res.status(201).json({
            message: "The following user has been registered:",
            users: req.body
        });
    } catch (error) {
        return res.status(500).get(errorMessage(error));
    }
};


const loginUser: eventHandler = async (event) => {
    const {email} = event.payload as LoginReq;
    const {password} = event.payload as LoginReq;
    logging.debug(NAMESPACE, "email: ", email);
    logging.debug(NAMESPACE, "password: ", password);
    try {
        logging.info(NAMESPACE, "Login info received.");
        const usersInDB = await db.select().from(users).where(eq(users.email,email));
        logging.info(NAMESPACE, "Users info retrieved from database.", usersInDB);
        if (usersInDB.length == 0) {
            return {
                statusCode: 401,
                error: new Error("Email is incorrect or not registered.")
            };
        }
        
        let refreshToken: string, accessToken: string;

        const result = bcrypt.compareSync(password, usersInDB[0].password);
        if (result) {
            signJWT(usersInDB[0], "refreshPrivateKey", (_error, payload) => {
                if (_error) {
                    logging.error(NAMESPACE, "Refresh token signing failed.", _error);
                    throw _error;
                } else if (payload) {
                    logging.info(NAMESPACE, "Refresh token signed and stored in locals.");
                    refreshToken = payload;
                }
            });
            
            signJWT(usersInDB[0], "accessPrivateKey", (_error, payload) => {
                if (_error) {
                    logging.error(NAMESPACE, "Refresh token signing failed.", _error);
                    throw _error;
                } else if (payload) {
                    logging.info(NAMESPACE, "---------END OF LOGIN PROCESS---------")
                    accessToken = payload;
                    return {
                        statusCode: 200,
                        data: {
                            message: "Both tokens authentication successful. Login Success!",
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            user: usersInDB[0]
                        } 
                    };
                }
            });
            return {
                statusCode: 200,
                data: {
                    message: "Both tokens authentication successful. Login Success!",
                    user: usersInDB[0]
                } 
            };
        } else {
                return {
                    statusCode: 401,
                    error: new Error("Incorrect password")
                };
            }
    } catch (error) {
        return {
            statusCode: 500,
            error: error 
        };
    }
};

export default {
    validateToken,
    loginUser,
    register,
    refreshAccessToken
};