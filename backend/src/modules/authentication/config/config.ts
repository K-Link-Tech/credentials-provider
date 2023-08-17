import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({path: resolve(__dirname, "../../../../.env")});

const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'credential_provider';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASS = process.env.POSTGRES_PASS || 'Micahsim00**';

const POSTGRES = {
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    pass: POSTGRES_PASS
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const ACCESS_TOKEN_ISSUER = process.env.ACCESS_TOKEN_ISSUER || 'K-Link';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'wrongAccessSecret';
const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY || 'wrongAccessPrivateKey';
const ACCESS_TOKEN_PUBLIC_KEY = process.env.ACCESS_TOKEN_PUBLIC_KEY || 'wrongAccessPublicKey';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'wrongRefreshSecret';
const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY || 'wrongRefreshPrivateKey';
const REFRESH_TOKEN_PUBLIC_KEY = process.env.REFRESH_TOKEN_PUBLIC_KEY || 'wrongRefreshPublicKey';


const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: ACCESS_TOKEN_ISSUER,
        accessSecret: ACCESS_TOKEN_SECRET,
        refreshSecret: REFRESH_TOKEN_SECRET,
        accessPrivateKey: ACCESS_TOKEN_PRIVATE_KEY,
        accessPublicKey: ACCESS_TOKEN_PUBLIC_KEY,
        refreshPrivateKey: REFRESH_TOKEN_PRIVATE_KEY,
        refreshPublicKey: REFRESH_TOKEN_PUBLIC_KEY,
    }
};

const config = {
    drizzle: POSTGRES,
    server: SERVER
};

export default config;