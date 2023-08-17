import { Request, Response, Router } from 'express';
import handler from '../handlers/auth';
import { routerEnclose } from '../utils/routerEnclose';
import { extractBothJWT, extractRefreshJWT } from '../middleware/extractJWT';
import { LoginReq, RegisterReq } from '../interfaces/authRequest.interface';

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

router.get('/validate', extractBothJWT, handler.validateToken);
router.get('/refresh', extractRefreshJWT, handler.refreshAccessToken)


export default router;