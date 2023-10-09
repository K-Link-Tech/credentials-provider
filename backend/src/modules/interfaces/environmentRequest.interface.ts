import { JwtPayload } from "jsonwebtoken";

interface PayloadWithNameProjectIdData {
  name: string;
  project_id: string;
  data: JwtPayload;
}

interface PayloadWithIdData {
  id: string;
  data: JwtPayload;
}

interface PayloadWithData {
  data: JwtPayload;
}

interface UpdateEnvReqBody {
  name: string;
}

interface PayloadWithIdDataBody {
  id: string;
  data: JwtPayload;
  body: {
    name: string
  };
}

export {
  PayloadWithNameProjectIdData,
  PayloadWithIdData,
  PayloadWithData,
  PayloadWithIdDataBody,
  UpdateEnvReqBody
};