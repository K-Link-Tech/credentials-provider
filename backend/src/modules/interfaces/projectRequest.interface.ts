import { JwtPayload } from "jsonwebtoken";

interface PayloadWithNameUrlData {
  name: string;
  url: string;
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
}

export {
  PayloadWithNameUrlData,
  PayloadWithData,
  PayloadWithIdData,
  PayloadWithIdDataBody,
  UpdateReqBody
}