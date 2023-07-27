import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { resolve } from 'path';

dotenv.config({path: resolve(__dirname, "../../../../.env")});

type User = {
    id: string,
    name: string,
    email: string
}

function jwtTokens(user: User) {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET ||"";
    const accessToken = jwt.sign(user, accessSecret, {expiresIn:'15m'});
    const refreshToken = jwt.sign(user, refreshSecret, {expiresIn:'1d'});
    return ({accessToken, refreshToken});
};

export {
   jwtTokens,
};