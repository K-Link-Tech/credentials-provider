import { uuid } from "drizzle-orm/pg-core";

interface LoginReq {
    email: string;
    password: string;
}

interface RegisterReq {
    name: string;
    email: string;
    password: string;
}

interface RefreshAccessReq {
    id: string;
}

interface extractJWTReq {
    accessToken?: string,
    refreshToken: string,
}

interface DecodedJWTObj {
    id: string,
    name: string,
    email: string,
    iat: number,
    exp: number,
    iss: string
}


export {
    LoginReq,
    RegisterReq,
    RefreshAccessReq,
    extractJWTReq,
    DecodedJWTObj
}