import { Request, Router } from 'express';
import handler from '../handlers/user';
import { routerEnclose, routerEncloseAuthentication } from '../utils/routerEnclose';
import authenticateToken from '../middleware/authorization';
import { DecodedJWTObj } from '../interfaces/authRequest.interface';

const router = Router();

// get users by id
router.get(
    '/:id',
    routerEncloseAuthentication(authenticateToken, ( req: Request ) => {
        const authHeader: string | undefined = req.headers['authorization']; // contains "Bearer TOKEN"
        return {
            source: "express",
            payload: authHeader
        }
    }),
    routerEnclose(handler.getUsers, ( req: Request ) => {
        const params = req.params.id;
        const data = req.body.data as DecodedJWTObj;
        return {    
            source: "express",
            payload: {
                id: params,
                authData: data
            }
        }
    })
);

// get all users
router.get(
    '/',
    routerEncloseAuthentication(authenticateToken, ( req: Request ) => {
        const authHeader: string | undefined = req.headers['authorization']; // contains "Bearer TOKEN"
        return {
            source: "express",
            payload: authHeader
        }
    }), 
    routerEnclose(handler.getUsers, ( req: Request ) => {
        const data = req.body.data;
        return {
            source: "express",
            payload: {
                id: null,
                authData: data
            }
        }
    })
);

// deletes a specific user
router.delete(
    '/:id',
    routerEncloseAuthentication(authenticateToken, ( req: Request ) => {
        const authHeader: string | undefined = req.headers['authorization']; // contains "Bearer TOKEN"
        return {
            source: "express",
            payload: authHeader
        }
    }),
    routerEnclose(handler.deleteUser, ( req: Request ) => {
        const data = req.body.data;
        const params = req.params.id;
        return {
            source: "express",
            payload: {
                id: params,
                authData: data
            }
        }
    })
);

// deletes all users
router.delete(
    '/',
    routerEncloseAuthentication(authenticateToken, ( req: Request ) => {
        const authHeader: string | undefined = req.headers['authorization']; // contains "Bearer TOKEN"
        return {
            source: "express",
            payload: authHeader
        }
    }),
    routerEnclose(handler.deleteAllUsers, ( req: Request ) => {
        const data = req.body.data;
        return {
            source: "express",
            payload: {
                id: null,
                authData: data
            }
        }
    })
);

// updates a user
router.patch(
    '/:id',
    routerEncloseAuthentication(authenticateToken, ( req: Request ) => {
        const authHeader: string | undefined = req.headers['authorization']; // contains "Bearer TOKEN"
        return {
            source: "express",
            payload: authHeader
        }
    }),
    routerEnclose(handler.updateUser, ( req: Request ) => {
        const data = req.body;
        const params = req.params.id;
        return {
            source: "express",
            payload: {
                id: params,
                body: data
            }
        }
    })
);


export default router;