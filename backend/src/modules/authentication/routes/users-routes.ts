import { Router } from 'express';
import controller from '../controller';

const router = Router();

router.get('/', controller.getAllUsers);

router.post('/', controller.addNewUser);

export default router;