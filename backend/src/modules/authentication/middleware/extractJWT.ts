import logging from "../config/logging.config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const NAMESPACE = "Auth";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating token...");

    let accessToken = req.headers.authorization?.split(' ')[1];
    let refreshToken = req.headers.authorization?.split(' ')[2];

    if (accessToken && refreshToken) {
        jwt.verify(accessToken, config.server.token.accessSecret, (error, decoded) => {
            if (error) {
                logging.error(NAMESPACE, "Access token given is invalid!")
                return res.status(404).json({
                    message: error.message,
                    error
                });
            } else {
                logging.info(NAMESPACE, "Access token validated.");
                res.locals.accessPayload = decoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
                logging.info(NAMESPACE, "Access token stored in locals.");
            }
        });
        jwt.verify(refreshToken, config.server.token.refreshSecret, (error, decoded) => {
            if (error) {
                logging.error(NAMESPACE, "Refresh token given is invalid!")
                return res.status(404).json({
                    message: error.message,
                    error
                });
            } else {
                logging.info(NAMESPACE, "Refresh token validated.");
                res.locals.refreshPayload = decoded; // passing the decoded to the endpoint, saving the variable to the middleware that is going to use this payload next
                logging.info(NAMESPACE, "Refresh token stored in locals.");
                next();
            }
        });

    } else {
        logging.error(NAMESPACE, "User is unauthorized!")
        return res.status(401).json({
            message: "Unauthorized!"
        });
    }
};

export default extractJWT;