import express, { Express, Request, Response ,json } from 'express';
import { resolve } from 'path';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import userRouter from "./modules/routes/users-routes";
import authRouter from "./modules/routes/auth-routes";

dotenv.config({path: resolve(__dirname, "../../../.env")});

const app: Express = express();
const PORT = 3000;
const corsOption = { credentials: true, origin: "http://localhost:3000" };

app.use(cors(corsOption));
app.use(json());
app.use(cookieParser());


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Credential Provider Landing Page");
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
