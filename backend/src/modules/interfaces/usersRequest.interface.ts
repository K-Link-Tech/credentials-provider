import jwt from 'jsonwebtoken';
interface ReqParams {
    id: string;
    body?: object;
    authData: string | jwt.JwtPayload | undefined;
}

interface UpdateParams {
    name?: string | undefined,
    email?: string | undefined,
    password?: string | undefined,
    authData: string | jwt.JwtPayload | undefined;
}

export {
    ReqParams,
    UpdateParams
}