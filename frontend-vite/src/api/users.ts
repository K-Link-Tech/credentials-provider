import { ALL_USERS_URL, ONE_USER_URL, LOGIN_URL } from "@/utils/constants";
import api from "./axios";


interface IUserPayload {
  email: string;
  password: string;
}

const logUserIn = async (userPayload: IUserPayload) => {
  return await api.post(LOGIN_URL, userPayload);
};

const getUser = async (id: string): Promise<IGetUsersData> => {
  const r = await api.get(`${ONE_USER_URL}/${id}`);
  return r.data
}

const getAllUsers = async (): Promise<IGetUsersData> => {
  const r = await api.get(ALL_USERS_URL);
  return r.data;
}

const deleteUser = async (id: string) => {
  const r = await api.delete(`${ONE_USER_URL}/${id}`);
  return r.data
}

const deleteAllUsers = async () => {
  const r = await api.delete(ALL_USERS_URL);
  return r.data;
}

const updateUser = async (id: string) => {
  const r = await api.patch(`${ONE_USER_URL}/${id}`);
  return r.data
}

export {
  logUserIn,
  getUser,
  getAllUsers,
  deleteUser,
  deleteAllUsers,
  updateUser
};
