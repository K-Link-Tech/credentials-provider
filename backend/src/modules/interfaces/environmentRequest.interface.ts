import { JwtPayload } from "jsonwebtoken";

interface PayloadWithNameProjectIdData {
  name: string;
  project_id: string;
  data: JwtPayload;
}

export {
  PayloadWithNameProjectIdData
};