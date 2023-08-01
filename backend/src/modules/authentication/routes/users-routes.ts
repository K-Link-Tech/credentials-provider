import { Router } from 'express';
import controller from '../controllers/user';
import authenticateToken from '../middleware/authorization';

const router = Router();



router.post('/login', controller.loginUserNew);
router.post('/register', controller.register);
router.get('/get/all', authenticateToken, controller.getAllUsersNew);

export default router;