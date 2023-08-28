import { getErrorMessage } from "../../errorHandler";
import dotenv from "dotenv";
import { resolve } from "path";
import { verifyJWT } from "../utils/JWT-helpers";
import logging from "../config/logging.config";

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const NAMESPACE = "Authorization";

type event = {
    source: string
    payload: string | undefined
};

type eventHandler = ( event: event ) => Object;

const authenticateToken: eventHandler = async ( event ) => {
    const authHeader = event.payload;
    if (authHeader == undefined) {
        logging.error(NAMESPACE, "Authorization header is empty.")
        return {
            statusCode: 401,
            error: new Error("Null token received.")
        };
    };
    const token = authHeader.split(' ')[1];
    logging.debug(NAMESPACE, "Authorization header obtained.", token);

    try {
        const accessDecoded = verifyJWT(token, "accessPublicKey");
        logging.debug(NAMESPACE, "JWT verified!", accessDecoded);
        return {
            statusCode: 200,
            data: accessDecoded
        }

    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        return {
            statusCode: 401,
            error: new Error("Token validation error!")
        };
    }
};

export default authenticateToken;