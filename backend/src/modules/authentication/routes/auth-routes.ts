import express, { Express, Request, Response, Router } from 'express';
import handler from '../handlers/auth';
import { routerEnclose } from '../utils/routerEnclose';
import { extractBothJWT, extractRefreshJWT } from '../middleware/extractJWT';
import { LoginReq } from '../interfaces/authRequest.interface';

const router = Router();

router.post('/register', handler.register);

router.post(
    '/login', 
    routerEnclose(handler.loginUser, ( req: Request, res: Response ) => {
        const body: LoginReq = req.body; 
        return {
            source: "express",
            payload: body
        }
    })
);

router.get('/validate', extractBothJWT, handler.validateToken);
router.get('/refresh', extractRefreshJWT, handler.refreshAccessToken)


export default router;