import express, { Express, Request, Response, Router } from 'express';
import db from '../db';
import bcrypt from "bcrypt";
import errorMessage from "../../../../errorHandler";
import { users } from '../schema/users.schema';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const usersRequested = await db.select().from(users);
        res.json({users : usersRequested.forEach});
    } catch (error) {
        res.status(500).get(errorMessage(error));
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password);         
    } catch (error) {
        
    }
});


export default router;