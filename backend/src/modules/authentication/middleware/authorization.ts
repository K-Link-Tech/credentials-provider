import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { resolve } from "path";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import User from "../interfaces/user.interface";
import getErrorMessage from "../../../../errorHandler";
import { Request, Response, NextFunction } from "express";

dotenv.config({path: resolve(__dirname, "../../../../.env")});

function authenticateToken( req: Request , res: Response, next : NextFunction ){
    const authHeader = req.headers['authorization']; // contains "Bearer TOKEN"
    if (authHeader == null) {
        return res.status(401).json({error: "Null token received."});
    };
    const token = authHeader.split(' ')[1];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
    jwt.verify(token, accessSecret, (error, payload) => {
        if (error) {
            return res.status(403).json({error: getErrorMessage(error)});
        }
        res.locals.jwt = payload;
        return next(); 
    });
};

export default authenticateToken;