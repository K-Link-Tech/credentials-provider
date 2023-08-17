import logging from "../config/logging.config";
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/JWT-helpers";

const NAMESPACE = "Auth/extractJWT";

const extractBothJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating token...");

    let accessToken = req.headers.authorization?.split(' ')[1];
    let refreshToken = req.headers.authorization?.split(' ')[2];

    if (accessToken && refreshToken) {
        try {
            const accessDecoded = verifyJWT(accessToken, "accessPublicKey");
            logging.info(NAMESPACE, "Access token validated.");
            res.locals.accessPayload = accessDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Access token stored in locals.");

        } catch (error) {
            return res.status(401).json({
                message: "Access token validation error:",
                error: error
            });
        }
        try {
            const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
            logging.info(NAMESPACE, "Refresh token validated.");
            res.locals.refreshPayload = refreshDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Refresh token stored in locals.");
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Refresh token validation error:",
                error: error
            });
        }
    } else {
        logging.error(NAMESPACE, "User is unauthorized!")
        return res.status(401).json({
            message: "Unauthorized!"
        });
    }
};

const extractRefreshJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating token...");

    let refreshToken = req.headers.authorization?.split(' ')[2];

    if (refreshToken) {
        try {
            const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
            logging.info(NAMESPACE, "Refresh token validated.");
            res.locals.refreshPayload = refreshDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Refresh token stored in locals.");
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Refresh token validation error:",
                error: error
            });
        }
    } else {
        logging.error(NAMESPACE, "User is unauthorized!")
        return res.status(401).json({
            message: "Unauthorized!"
        });
    }
};

export {
    extractBothJWT,
    extractRefreshJWT
};