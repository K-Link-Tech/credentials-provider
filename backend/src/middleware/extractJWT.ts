import logging from "../config/logging.config";
import { verifyJWT } from "../utils/JWT-helpers";
import { extractJWTReq } from "../modules/interfaces/authRequest.interface";
import { getErrorMessage } from "../../errorHandler";

const NAMESPACE = "Auth/extractJWT";

type event = {
    source: string
    payload: Object
};

type eventHandler = ( event: event ) => Object;

const extractBothJWT: eventHandler = async (event) => {
    logging.info(NAMESPACE, "Validating token...");
    const {accessToken, refreshToken} = event.payload as extractJWTReq;

    if (accessToken && refreshToken) {
        try {
            const accessDecoded = verifyJWT(accessToken, "accessPublicKey");
            logging.info(NAMESPACE, "Access token validated.");
            const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
            logging.info(NAMESPACE, "Refresh token validated.");

            logging.info(NAMESPACE, "Access & Refresh tokens are stored in req.data as Object.");
            return {
                statusCode: 200,
                data: {
                    accessDecoded: accessDecoded,
                    refreshDecoded: refreshDecoded
                }
            }
        } catch (error) {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            return {
                statusCode: 401,
                error: new Error("Failed to verify JWT Tokens!")
            };
        }
    } else {
        logging.error(NAMESPACE, "User is unauthorized!");
        return {
            statusCode: 401,
            error: new Error("User is unauthorized!")
        };
    }
};

const extractRefreshJWT: eventHandler = async (event) => {
    logging.info(NAMESPACE, "Validating token...");

    const {refreshToken} = event.payload as extractJWTReq;

    if (refreshToken) {
        try {
            const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
            logging.info(NAMESPACE, "Refresh token validated.");
            const decoded = refreshDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Refresh token stored in locals.");
            return {
                statusCode: 200,
                data: decoded
            }
        } catch (error) {
            logging.error(NAMESPACE, getErrorMessage(error), error)
            return {
                statusCode: 401,
                error: new Error("Failed to verify refresh token!")
            };
        }
    } else {
        logging.error(NAMESPACE, "Unauthorized refresh token!")
        return {
            statusCode: 401,
            error: new Error("User is unauthorized!")
        };
    }
};

export {
    extractBothJWT,
    extractRefreshJWT
};