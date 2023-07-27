import db from './db';
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Request, Response, } from 'express';
import { jwtTokens } from './utils/jwt-helpers';
import errorMessage from '../../../errorHandler';
import { users } from './schema/users.schema';

// module to fetch all users in db
const getAllUsers =  async (req: Request, res: Response) => {
    try {
        console.log("Fetching data from database.");
        const usersRequested = await db.select().from(users);
        console.log("Data has been fetched... \nDisplaying now: \n");
        res.json({users : usersRequested});
    } catch (error) {
        res.status(500).get(errorMessage(error));
    }
};

// module to add new user into db
const addNewUser = async (req: Request, res: Response) => {
    try {
        const newUser = req.body;
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        console.log("Password hashed!")
        await db.insert(users).values({ 
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        });
        console.log("Data has been sent to database");
        res.status(201).json({users: newUser});
        console.log("Data displayed.")        
    } catch (error) {
        res.status(500).get(errorMessage(error));
    }
}

// module to log user in
const loginUser = async (req:Request, res: Response) => {
    try {
        const userDetails = req.body;

        const usersInDB = await db.select().from(users).where(eq(users.email,userDetails.email));
        if (usersInDB.length == 0)
        return res.status(401).json({error: "Email is incorrect or not registered."});
        
        // email found, now checking password
        const validPassword = await bcrypt.compare(userDetails.password, usersInDB[0].password);
        if (!validPassword)
        return res.status(401).json({error: "Incorrect password."});

        // return JWT
        let tokens = jwtTokens(usersInDB[0]);
        res.cookie("refresh_token", tokens.refreshToken, {httpOnly: true});
        res.json(tokens);
        return res.status(200).json("Login Success!");
    } catch (error) {
        res.status(401).get(errorMessage(error));
    }    
}

export default {
    getAllUsers,
    addNewUser,
    loginUser,
}

