import logging from "../config/logging.config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../utils/JWT-helpers";
import config from "../config/config";

const NAMESPACE = "Auth";

const extractBothJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating token...");

    let accessToken = req.headers.authorization?.split(' ')[1];
    let refreshToken = req.headers.authorization?.split(' ')[2];

    if (accessToken && refreshToken) {
        const accessDecoded = verifyJWT(accessToken, "accessPublicKey");
        if (accessDecoded instanceof Error) {
            logging.error(NAMESPACE, "Access token given is invalid!")
            return res.status(404).json({
                message: accessDecoded.message,
                accessDecoded
            });
        } else {
            logging.info(NAMESPACE, "Access token validated.");
            res.locals.accessPayload = accessDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Access token stored in locals.");
        }
        const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
        if (refreshDecoded instanceof Error) {
            logging.error(NAMESPACE, "Refresh token given is invalid!")
            return res.status(404).json({
                message: refreshDecoded.message,
                refreshDecoded
            });
        } else {
            logging.info(NAMESPACE, "Refresh token validated.");
            res.locals.refreshPayload = refreshDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Refresh token stored in locals.");
            next();
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

    let accessToken = req.headers.authorization?.split(' ')[1];
    let refreshToken = req.headers.authorization?.split(' ')[2];

    if (refreshToken) {
        const refreshDecoded = verifyJWT(refreshToken, "refreshPublicKey");
        if (refreshDecoded instanceof Error) {
            logging.error(NAMESPACE, "Refresh token given is invalid!")
            return res.status(404).json({
                message: refreshDecoded.message,
                refreshDecoded
            });
        } else {
            logging.info(NAMESPACE, "Refresh token validated.");
            res.locals.refreshPayload = refreshDecoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
            logging.info(NAMESPACE, "Refresh token stored in locals.");
            next();
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