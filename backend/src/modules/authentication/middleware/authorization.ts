import jwt from "jsonwebtoken";
import getErrorMessage from "../../../../errorHandler";
import dotenv from "dotenv";
import { resolve } from "path";
import { verifyJWT } from "../utils/JWT-helpers";
import { Request, Response, NextFunction } from "express";
import logging from "../config/logging.config";

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const NAMESPACE = "Authorization";

const authenticateToken = ( req: Request , res: Response, next : NextFunction ) => {
    const authHeader = req.headers['authorization']; // contains "Bearer TOKEN"
    if (authHeader == null) {
        return res.status(401).json({error: "Null token received."});
    };
    const token = authHeader.split(' ')[1];
    try {
        const accessDecoded = verifyJWT(token, "accessPublicKey");
        res.locals.verified = accessDecoded;

    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        return res.status(401).json({
            message: "Token validation error!"
        });
    }
    return next(); 
};

export default authenticateToken;