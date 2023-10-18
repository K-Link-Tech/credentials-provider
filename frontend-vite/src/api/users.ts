import { GET_ALL_USERS_URL, GET_USER_URL, LOGIN_URL } from "@/utils/constants";
import axios from "axios";


interface IUserPayload {
  email: string;
  password: string;
}

const logUserIn = async (userPayload: IUserPayload) => {
  return await axios.post(LOGIN_URL, userPayload);
};

const getUser = async (id: string) => {
  const r = await axios.get(`${GET_USER_URL}/${id}`);
  return r.data
}

const getAllUsers = async () => {
  const r = await axios.get(GET_ALL_USERS_URL);
  return r.data;
}

export {
  logUserIn,
  getUser,
  getAllUsers
};
