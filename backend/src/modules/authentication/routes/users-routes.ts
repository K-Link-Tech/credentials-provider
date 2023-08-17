import { Request, Router } from 'express';
import handler from '../handlers/user';
import { routerEnclose } from '../utils/routerEnclose';

const router = Router();


// get users by id
router.get(
    '/:id',
    routerEnclose(handler.getUsers, ( req: Request ) => {
        const params = req.params.id
        return {    
            source: "express",
            payload: {
                id: params
            }
        }
    })
);

// get all users
router.get(
    '/', 
    routerEnclose(handler.getUsers, ( req: Request ) => ({
        source: "express",
        payload: {
            id: null
        }
    }))
);

router.delete('/:id', handler.deleteUser);

router.delete('/', handler.deleteAllUsers);

router.patch('/:id', handler.updateUser);


export default router;