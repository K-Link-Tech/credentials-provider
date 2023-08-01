import { Router } from 'express';
import controller from '../controllers/user';
import authenticateToken from '../middleware/authorization';

const router = Router();


router.post('/register', controller.register);
router.get('/get/:id', authenticateToken, controller.getUsers);
router.get('/get/', authenticateToken, controller.getUsers);

export default router;