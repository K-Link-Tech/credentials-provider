import express, { Express, Request, Response ,json } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import userRouter from "./routes/users-routes";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();

//const __dirname = dirname(fileURLToPath('backend\src\modules\authentication\public'));

const app: Express = express();
const PORT = 3000;
const corsOption = { credentials: true, origin: "http://localhost:3000" };

app.use(cors(corsOption));
app.use(json());
app.use(cookieParser());

//app.use('/', express.static(join(__dirname, 'public')));

app.use('/api/users', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Credential Provider Landing Page");
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));

