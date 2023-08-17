import { Request, Response } from 'express';
import logging from '../config/logging.config';

type routerEncloseFunction = (fn: Function, formatExchange: Function) => (req: Request, res: Response) => void;

type handlerReturnObject = {
    statusCode: number,
    data: Object,
    error: Error
}

const NAMESPACE = "routerEnclose";

export const routerEnclose: routerEncloseFunction = (fn, formatExchange) => (req, res) => {
    fn(formatExchange ? formatExchange(req) : req).then(
        (returnObject: handlerReturnObject) => {
            logging.info(NAMESPACE, "testing type of statusCode: ", typeof(returnObject))
            if (returnObject.statusCode >= 200 && returnObject.statusCode < 300) {
                return res.status(returnObject.statusCode).json(returnObject.data);
            } else {
                return res.status(returnObject.statusCode).json(returnObject.error?.message);
            }
        },
    );
};