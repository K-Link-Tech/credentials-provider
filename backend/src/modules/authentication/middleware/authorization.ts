import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { resolve } from "path";
import { verifyJWT } from "../utils/JWT-helpers";
import getErrorMessage from "../../../../errorHandler";
import User from '../interfaces/user.interface';
import { Request, Response, NextFunction } from "express";
import logging from "../config/logging.config";
import { error } from "console";

dotenv.config({path: resolve(__dirname, "../../../../.env")});

function authenticateToken( req: Request , res: Response, next : NextFunction ){
    const authHeader = req.headers['authorization']; // contains "Bearer TOKEN"
    if (authHeader == null) {
        return res.status(401).json({error: "Null token received."});
    };
    const token = authHeader.split(' ')[1];
    try {
        const accessDecoded = verifyJWT(token, "accessPublicKey");
        res.locals.verified = accessDecoded;

    } catch (error) {
        return res.status(401).json({
            message: "Token validation error:",
            error: error
        });
    }
    
    return next(); 
};

export default authenticateToken;