import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { resolve } from 'path';
import errorMessage from '../../../../errorHandler';
import logging from '../config/logging.config';
import User from '../interfaces/user.interface';
import config from '../config/config';

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const NAMESPACE = "Auth";

function jwtTokens(user: User) {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "";
    const accessToken = jwt.sign(user, accessSecret, {expiresIn:'15m'});
    const refreshToken = jwt.sign(user, refreshSecret, {expiresIn:'1d'});
    return ({accessToken, refreshToken});
};

const signJWT = (user: User, callback: (error: Error | null, token: string | null) => void): void => {
    logging.info(NAMESPACE, `Attempting to sign token for ${user.name}`);

    try {
        jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            }, config.server.token.secret, 
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: '15min'
            }, (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        logging.error(NAMESPACE, errorMessage(error), error);
        callback(new Error("Error while signing jwt."), null);
    }
};

export {
   jwtTokens,
   signJWT
};