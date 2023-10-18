import { LOGIN_URL } from "@/utils/constants";
import axios from "axios";


interface IUserPayload {
  email: string;
  password: string;
}

const logUserIn = async (userPayload: IUserPayload) => {
  return axios.post(LOGIN_URL, userPayload)
};

export {
  logUserIn
};
