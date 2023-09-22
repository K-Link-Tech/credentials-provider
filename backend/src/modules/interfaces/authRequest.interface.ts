type roles = "admin" | "user";
interface LoginReq {
  email: string;
  password: string;
}

interface RegisterReq {
  name: string;
  role: roles;
  email: string;
  password: string;
}

interface RefreshAccessReq {
  id: string;
}

interface extractJWTReq {
  accessToken?: string | undefined,
  refreshToken: string | undefined,
}

interface DecodedJWTObj {
  id: string,
  name: string,
  email: string,
  role: roles,
  iat: number,
  exp: number,
  iss: string
}

export {
  LoginReq,
  RegisterReq,
  RefreshAccessReq,
  extractJWTReq,
  DecodedJWTObj,
}