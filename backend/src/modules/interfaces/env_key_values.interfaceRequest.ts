import { JwtPayload } from "jsonwebtoken";
import { encryptionEnum } from "../../schema/env_key_values.schema"

interface PayloadWithValueEncryptionEnvironmentIdData {
  value: string;
  encryption_method: typeof encryptionEnum;
  environment_id: string;
  data: JwtPayload;
}

interface PayloadWithIdDataBody {
  id: string;
  data: JwtPayload;
  body: {
    value: string,
    encryption_method: typeof encryptionEnum;
  };
}

interface PayloadWithIdData {
  id: string;
  data: JwtPayload;
}

interface PayloadWithData {
  data: JwtPayload;
}

interface UpdateEnvKeyReqBody {
  value: string;
  encryption_method: string
}

export {
  PayloadWithValueEncryptionEnvironmentIdData,
  PayloadWithIdData,
  PayloadWithData,
  UpdateEnvKeyReqBody,
  PayloadWithIdDataBody
};