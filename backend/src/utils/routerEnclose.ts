import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging.config';
import { DecodedJWTObj } from '../modules/interfaces/authRequest.interface';

type routerEncloseFunction = (fn: Function, formatExchange: Function) => (req: Request, res: Response , next: NextFunction) => NextFunction | void;

type handlerReturnObject = {
    statusCode: number,
    data: Object,
    error: Error
}

type handlerAuthReturnObject = {
    statusCode: number,
    data: DecodedJWTObj,
    error: Error
}

type handlerRoleReturnObject = {
    statusCode: number,
    isAuthorized: boolean,
    error: Error
}

/**
 * Variable to store namespace for logging.
 */
const NAMESPACE = "routerEnclose";

/**
 * This function supports Clean Architecture by separating express web framework from controllers.
 * 
 * @param fn A controller function
 * @param formatExchange A function processing Request body or simply just Request.
 * @returns Response with status code and either json object or error message depending on the returnObject of controller function.
 */

export const routerEnclose: routerEncloseFunction = (fn, formatExchange) => (req, res) => {
    logging.info(NAMESPACE, "ROUTER function hit!")
    fn(formatExchange ? formatExchange(req) : req).then(
        (returnObject: handlerReturnObject) => {
            logging.info(NAMESPACE, "testing type of statusCode in ROUTER: ", typeof(returnObject))
            if (returnObject.statusCode >= 200 && returnObject.statusCode < 300) {
                return res.status(returnObject.statusCode).json(returnObject.data);
            } else {
                return res.status(returnObject.statusCode).json(returnObject.error?.message);
            }
        },
    );
};

/**
 * This function supports Clean Architecture by by separating express web framework from middleware.
 * 
 * @param fn An authentication function
 * @param formatExchange A function processing the Request header or simply just Request.
 * @returns Either NextFunction or Response with statuscode and error message depending on the returnObject of authentication function.
 */
export const routerEncloseAuthentication: routerEncloseFunction = (fn, formatExchange) => (req, res, next) => {
    logging.info(NAMESPACE, "AUTH function hit!")
    fn(formatExchange ? formatExchange(req) : req).then(
        (returnObject: handlerAuthReturnObject) => {
            logging.info(NAMESPACE, "testing type of statusCode in AUTH: ", typeof(returnObject))
            if (returnObject.statusCode >= 200 && returnObject.statusCode < 300) {
                req.body.data = returnObject.data;
                return next();
            } else {
                return res.status(returnObject.statusCode).json(returnObject.error?.message);
            }
        },
    );
};

/**
 * This function supports Clean Architecture by by separating express web framework from middleware.
 * 
 * @param fn A permissions check function
 * @param formatExchange A function processing the Request header or simply just Request.
 * @returns Either NextFunction or Response with statuscode and error message depending on the returnObject of authentication function.
 */
export const routerEnclosePermissions: routerEncloseFunction = (fn, formatExchange) => (req, res, next) => {
    logging.info(NAMESPACE, "PERMS function hit!")
    fn(formatExchange ? formatExchange(req) : req).then(
        (returnObject: handlerRoleReturnObject) => {
            logging.info(NAMESPACE, "testing type of statusCode in AUTH: ", typeof(returnObject))
            if (returnObject.statusCode >= 200 && returnObject.statusCode < 300) {
                req.body.isAuthorized = returnObject.isAuthorized;
                return next();
            } else {
                return res.status(returnObject.statusCode).json(returnObject.error?.message);
            }
        },
    );
};