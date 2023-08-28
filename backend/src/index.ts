import express, { Express, Request, Response, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './modules/routes/users-routes';
import authRouter from './modules/routes/auth-routes';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, './../.env'),
});

console.log(process.env.PORT);

const app: Express = express();
const port = process.env.PORT || 3000;
const corsOption = { credentials: true, origin: `http://localhost:${port}` };

app.use(cors(corsOption));
app.use(json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Credential Provider Landing Page');
});

app.listen(port, () => console.log(`Server is listening on ${port}`));
