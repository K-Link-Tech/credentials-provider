import express, { Express, Request, Response, Router } from 'express';
import controller from '../controllers/user';
import { extractBothJWT, extractRefreshJWT } from '../middleware/extractJWT';

const router = Router();

// handle login

router.get('/validate', extractBothJWT, controller.validateToken);
router.get('/refresh', extractRefreshJWT, controller.refreshAccessToken)
router.post('/login', controller.loginUser);


export default router;