import { Router } from 'express';
import handler from '../handlers/user';
import { routerEnclose } from '../utils/routerEnclose';

const router = Router();


// get users by id
router.get(
    '/:id',
    routerEnclose(handler.getUsers, ( params: string ) => ({
            source: "express",
            payload: params
    }))
);

// get all users
router.get(
    '/', 
    routerEnclose(handler.getUsers, ( params: string ) => ({
        source: "express",
        payload: params
    }))
);

router.delete('/:id', handler.deleteUser);

router.delete('/', handler.deleteAllUsers);

router.patch('/:id', handler.updateUser);


export default router;