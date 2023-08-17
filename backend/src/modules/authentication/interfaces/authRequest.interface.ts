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
    id: typeof uuid;
}

export {
    LoginReq,
    RegisterReq,
    RefreshAccessReq
}