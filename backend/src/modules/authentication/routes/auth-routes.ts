import express, { Express, Request, Response, Router } from 'express';
import controller from '../controller';

const router = Router();

// handle login
router.post('/login', controller.loginUser);


export default router;