import express, { Express, Request, Response, Router } from 'express';
import controller from '../controllers/user';

const router = Router();

// handle login
router.post('/login', controller.loginUser);

router.get('/validate', controller.validateToken);


export default router;