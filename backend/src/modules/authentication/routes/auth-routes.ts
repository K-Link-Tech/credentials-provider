import express, { Express, Request, Response, Router } from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = Router();

// handle login

router.get('/validate', extractJWT, controller.validateToken);


export default router;