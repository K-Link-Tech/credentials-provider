import { JwtPayload } from "jsonwebtoken";
import { encryptionEnum } from "../../schema/env_key_values.schema"

type encryption = "aes-128" | "aes-192" | "aes-256" | "rsa-1024" | "rsa-2048";

interface PayloadWithValueEncryptionEnvironmentIdData {
  key: string;
  value: string;
  encryption_method: encryption;
  environment_id: string;
  data: JwtPayload;
}

interface PayloadWithIdDataBody {
  id: string;
  data: JwtPayload;
  body: {
    key?: string,
    value?: string,
    encryption_method?: encryption
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