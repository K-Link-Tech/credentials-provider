import { ALL_ENV_KEY_VALUES_URL, CREATE_NEW_ENV_KEY_VALUES_URL, ONE_ENV_KEY_VALUES_URL } from "@/utils/constants";
import api from "./axios";

const createNewEnvKeyValue = async (environmentPayload: INewEnvKeyValue) => {
  const r = await api.post(CREATE_NEW_ENV_KEY_VALUES_URL, environmentPayload);
  return r.data;
}

const getAllEnvKeyValues = async () => {
  const r = await api.get(ALL_ENV_KEY_VALUES_URL);
  return r.data;
}

const getEnvKeyValue = async (id: string) => {
  const r = await api.get(`${ONE_ENV_KEY_VALUES_URL}/${id}`);
  return r.data;
}

const deleteAllEnvKeyValues = async () => {
  const r = await api.delete(ALL_ENV_KEY_VALUES_URL);
  return r.data;
}

const deleteEnvKeyValue = async (id: string) => {
  const r = await api.delete(`${ONE_ENV_KEY_VALUES_URL}/${id}`);
  return r.data;
}

const updateEnvKeyValue = async (id: string, payload: IUpdateEnvKeyValue) => {
  const r = await api.patch(`${ONE_ENV_KEY_VALUES_URL}/${id}`, payload);
  return r.data;
}

export {
  createNewEnvKeyValue,
  getAllEnvKeyValues,
  getEnvKeyValue,
  deleteAllEnvKeyValues,
  deleteEnvKeyValue,
  updateEnvKeyValue
}