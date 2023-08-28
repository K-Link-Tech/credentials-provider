import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging.config';
import { DecodedJWTObj } from '../interfaces/authRequest.interface';

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

const NAMESPACE = "routerEnclose";

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