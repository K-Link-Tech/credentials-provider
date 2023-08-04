import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { resolve } from 'path';
import errorMessage from '../../../../errorHandler';
import logging from '../config/logging.config';
import User from '../interfaces/user.interface';
import config from '../config/config';

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const NAMESPACE = "Auth/JWT-helpers";

// function jwtTokens(user: User) {
//     const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
//     const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "";
//     const accessToken = jwt.sign(user, accessSecret, {expiresIn:'15m'});
//     const refreshToken = jwt.sign(user, refreshSecret, {expiresIn:'1d'});
//     return ({accessToken, refreshToken});
// };

const signJWT = (user: User, tokenType: string, callback: (error: Error | null, token: string | null) => void): void => {
    logging.info(NAMESPACE, `Attempting to sign ${tokenType} for ${user.name}...`);
    const tokenUsed = (tokenType == "accessPrivateKey") ? config.server.token.accessPrivateKey : config.server.token.refreshPrivateKey;
    const privateKey = Buffer.from(tokenUsed, 'base64').toString('ascii');

    try {
        jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            }, privateKey, 
            {
                issuer: config.server.token.issuer,
                algorithm: 'RS256',
                expiresIn: (tokenType == "accessPrivateKey") ? '15m' : '1d'
            }, (error, token) => {
                if (error) {
                    logging.info(NAMESPACE, `${tokenType} signing error occurred.`)
                    callback(error, null);
                } else if (token) {
                    logging.info(NAMESPACE, `The ${tokenType} for ${user.name} is successful!`);
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        logging.error(NAMESPACE, errorMessage(error), error);
        callback(new Error(`Error while signing ${tokenType} jwt.`), null);
    }
};

const verifyJWT = <T>(token: string, tokenType: string): T | void => {
    logging.info(NAMESPACE, `Attempting to verify ${tokenType}...`);
    const tokenUsed = (tokenType == "accessPublicKey") ? config.server.token.accessPublicKey : config.server.token.refreshPublicKey;
    const publicKey = Buffer.from(tokenUsed, 'base64').toString('ascii');

    try {
        return jwt.verify(token, publicKey, (error, decoded) => {
            if (error) {
                return error;
            } else {
                logging.info(NAMESPACE, `${tokenType} validated.`);
                return decoded; 
            }
        });
        
    } catch (error) {
        logging.error(NAMESPACE, errorMessage(error), error);
    }
};

export {
   signJWT,
   verifyJWT
};