import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { resolve } from 'path';
import { getErrorMessage } from '../../errorHandler';
import logging from '../config/logging.config';
import User from '../modules/interfaces/user.interface';
import config from '../config/config';
import { AuthenticationError } from './errorTypes';

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const NAMESPACE = "Auth/JWT-helpers";

const signJWT = (user: User, tokenType: string): string | Error => {
    logging.info(NAMESPACE, `Attempting to sign ${tokenType} for ${user.name}...`);
    const tokenUsed = (tokenType == "accessPrivateKey") ? config.server.token.accessPrivateKey : config.server.token.refreshPrivateKey;
    const privateKey = Buffer.from(tokenUsed, 'base64').toString('ascii');

    try {
        const token = jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, privateKey, {
                issuer: config.server.token.issuer,
                algorithm: 'RS256',
                expiresIn: (tokenType == "accessPrivateKey") ? '12h' : '1d' // TODO: change back the access token time to 15mins after testing
            }
        );
        logging.info(NAMESPACE, `Signing ${tokenType} for ${user.name} successful!`);
        return token;
    } catch (error) {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        throw new AuthenticationError(`Error while signing ${tokenType} jwt.`, "401");
    }
};

const verifyJWT = <T>(token: string, tokenType: string): T | void => {
    logging.info(NAMESPACE, `Attempting to verify ${tokenType}...`);
    const tokenUsed = (tokenType == "accessPublicKey") ? config.server.token.accessPublicKey : config.server.token.refreshPublicKey;
    const publicKey = Buffer.from(tokenUsed, 'base64').toString('ascii');

    return jwt.verify(token, publicKey, (error, decoded) => {
        if (error) {
            throw error;
        } else {
            logging.info(NAMESPACE, `${tokenType} validated.`);
            return decoded; 
        }
    });
};

export {
   signJWT,
   verifyJWT
};