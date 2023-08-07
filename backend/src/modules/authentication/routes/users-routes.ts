import { Router } from 'express';
import controller from '../controllers/user';
import authenticateToken from '../middleware/authorization';

const router = Router();


router.post('/register', controller.register);
router.get('/:id', authenticateToken, controller.getUsers);
router.get('/', authenticateToken, controller.getUsers);
router.delete('/:id', authenticateToken, controller.deleteUser);
router.delete('/', authenticateToken, controller.deleteAllUsers);
router.patch('/:id', authenticateToken, controller.updateUser);


export default router;