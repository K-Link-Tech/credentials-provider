import { Router } from 'express';
import controller from '../controllers/user';
import { authenticateToken } from '../middleware/authorization';

const router = Router();

router.get('/', controller.getAllUsers);

router.post('/', controller.addNewUser);

router.post('/login', controller.loginUserNew);
router.post('/register', controller.register);
router.get('/get/all', controller.getAllUsersNew);

export default router;