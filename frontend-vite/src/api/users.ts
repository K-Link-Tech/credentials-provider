import { GET_ALL_USERS_URL, GET_USER_URL, LOGIN_URL } from "@/utils/constants";
import api from "./axios";


interface IUserPayload {
  email: string;
  password: string;
}

const logUserIn = async (userPayload: IUserPayload) => {
  return await api.post(LOGIN_URL, userPayload);
};

const getUser = async (id: string) => {
  const r = await api.get(`${GET_USER_URL}/${id}`);
  return r.data
}

const getAllUsers = async () => {
  const r = await api.get(GET_ALL_USERS_URL);
  return r.data;
}

export {
  logUserIn,
  getUser,
  getAllUsers
};
