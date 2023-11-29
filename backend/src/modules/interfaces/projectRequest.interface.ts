import { JwtPayload } from "jsonwebtoken";

type scopes = "admin" | "user";

interface PayloadWithNameUrlScopeData {
  name: string;
  url: string;
  scope: scopes;
  data: JwtPayload;
}

interface PayloadWithData {
  data: JwtPayload;
}

interface PayloadWithIdData {
  id: string;
  data: JwtPayload;
}

interface PayloadWithIdDataBody {
  id: string;
  data: JwtPayload;
  body: object;
}

interface UpdateReqBody {
  name: string;
  url: string;
  scope: scopes;
}

export {
  PayloadWithNameUrlScopeData,
  PayloadWithData,
  PayloadWithIdData,
  PayloadWithIdDataBody,
  UpdateReqBody
};