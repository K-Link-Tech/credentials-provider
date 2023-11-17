import { ALL_ENV_KEY_VALUES_URL, ONE_ENV_KEY_VALUES_URL } from "@/utils/constants";
import api from "./axios";

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

const updateEnvKeyValue = async (id: string) => {
  const r = await api.patch(`${ONE_ENV_KEY_VALUES_URL}/${id}`);
  return r.data;
}

export {
  getAllEnvKeyValues as getAllEnvKeyValues,
  getEnvKeyValue,
  deleteAllEnvKeyValues,
  deleteEnvKeyValue,
  updateEnvKeyValue
}