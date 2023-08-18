import db from '../config/db';
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { signJWT } from '../utils/JWT-helpers';
import { users } from '../schema/users.schema';
import { DecodedJWTObj, LoginReq, RefreshAccessReq, RegisterReq } from '../interfaces/authRequest.interface';
import logging from '../config/logging.config';
import getErrorMessage from '../../../../errorHandler';

const NAMESPACE = "Auth-route";

type event = {
    source: string
    payload: Object
};

type eventHandler = ( event: event ) => Object;

const refreshAccessToken: eventHandler = async (event) => {
    logging.info(NAMESPACE, "Refresh token validated, user is authorized.");
    const { id } = event.payload as DecodedJWTObj;
    logging.debug(NAMESPACE, "id received: ", id);
    try {
        const userRequested =  await db.select().from(users).where(sql`${users.id} = ${id}`)
        if (userRequested.length == 0) {
            logging.error(NAMESPACE, "Uuid given cannot be found!", new Error("Uuid does not exist in database."));
            return { 
                statusCode: 404,
                error: new Error("User does not exist.")
            };
        }
        const accessToken = signJWT(userRequested[0], "accessPrivateKey");
        logging.info(NAMESPACE, "---------END OF ACCESS TOKEN REFRESH PROCESS---------");
        return {
            statusCode: 200,
            data: {
                message: "Refreshing of accessToken successful.",
                accessSigningPayload: accessToken,
                userType: userRequested[0]
            }        
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error)
        return {
            statusCode: 500,
            error: new Error("Refreshing accessToken failed.")
        };
    }
};

const validateToken: eventHandler = async (event) => {
    logging.info(NAMESPACE, "Token validated, user is authorized.");
    logging.info(NAMESPACE, "---------END OF TOKEN VALIDATION PROCESS---------");
    const decoded = event.payload;
    return {
        statusCode: 200,
        data: {
            message: "Authorized user.",
            decodedSignature: decoded
        }
    };
};

const register: eventHandler = async (event) => {
    const { name, email, password } = event.payload as RegisterReq;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        logging.info(NAMESPACE,"Password hashed!");
        await db.insert(users).values({ 
            name: name,
            email: email,
            password: hashedPassword
        });
        logging.info(NAMESPACE, "Data has been sent to database.");
        logging.info(NAMESPACE, "Data displayed.");   
        logging.info(NAMESPACE, "---------END OF REGISTRATION PROCESS---------")     
        return {
            statusCode: 201,
            data: {
                message: "The following user has been registered:",
                users: event.payload
            }
        };
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error) , error);
        return {
            statusCode: 403,
            error: new Error("User already exists.")
        };
    }
};

const loginUser: eventHandler = async (event) => {
    const {email} = event.payload as LoginReq;
    const {password} = event.payload as LoginReq;
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

        const result = bcrypt.compareSync(password, usersInDB[0].password);
        if (result) {
            const refreshToken = signJWT(usersInDB[0], "refreshPrivateKey");
            const accessToken = signJWT(usersInDB[0], "accessPrivateKey");
            return {
                statusCode: 200,
                data: {
                    message: "Both tokens authentication successful. Login Success!",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
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