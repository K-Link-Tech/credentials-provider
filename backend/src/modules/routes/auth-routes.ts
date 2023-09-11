import { Request, Router } from 'express';
import handler from '../handlers/auth';
import { routerEnclose, routerEncloseAuthentication } from '../../utils/routerEnclose';
import { extractBothJWT, extractRefreshJWT } from '../../middleware/extractJWT';
import { DecodedJWTObj, LoginReq, RegisterReq } from '../interfaces/authRequest.interface';

const router = Router();

router.post(
    '/register', 
    routerEnclose(handler.register, ( req: Request ) => {
        const body: RegisterReq = req.body; 
        return {
            source: "express",
            payload: body
        }
    })
);

router.post(
    '/login', 
    routerEnclose(handler.loginUser, ( req: Request ) => {
        const body: LoginReq = req.body; 
        return {
            source: "express",
            payload: body
        }
    })
);

router.get(
    '/validate', 
    routerEncloseAuthentication(extractBothJWT, ( req: Request ) => {
        const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
        const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
        return {
            source: "express",
            payload: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }
    }), 
    routerEnclose(handler.validateToken, ( req: Request ) => ({
        source: "express",
        payload: req.body.data
    }))
);

router.get(
    '/refresh', 
    routerEncloseAuthentication(extractRefreshJWT, ( req: Request ) => {
        const refreshToken = req.headers.authorization?.split(' ')[2];
        return {
            source: "express",
            payload: {
                refreshToken: refreshToken
            }
        } 
    }), 
    routerEnclose(handler.refreshAccessToken, ( req: Request ) => {
        const body: DecodedJWTObj = req.body.data
        return {
            source: "express",
            payload: body
        }
    })
);

export default router;