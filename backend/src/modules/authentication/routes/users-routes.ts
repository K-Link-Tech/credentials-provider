import express, { Express, Request, Response, Router } from 'express';
import db from '../db';
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

export default router;