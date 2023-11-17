import { ALL_ENVIRONMENTS_URL, CREATE_NEW_ENVIRONMENT_URL, ONE_ENVIRONMENT_URL } from "@/utils/constants";
import api from "./axios";


const createNewEnvironment = async (environmentPayload: INewEnvironment) => {
  const r = await api.post(CREATE_NEW_ENVIRONMENT_URL, environmentPayload);
  return r.data;
}

const getAllEnvironments = async () => {
  const r = await api.get(ALL_ENVIRONMENTS_URL);
  return r.data;
}

const getEnvironment = async (id: string) => {
  const r = await api.get(`${ONE_ENVIRONMENT_URL}/${id}`);
  return r.data;
}

const deleteAllEnvironments = async () => {
  const r = await api.delete(ALL_ENVIRONMENTS_URL);
  return r.data;
}

const deleteEnvironment = async (id: string) => {
  const r = await api.delete(`${ONE_ENVIRONMENT_URL}/${id}`);
  return r.data;
}

const updateEnvironment = async (id: string) => {
  const r = await api.patch(`${ONE_ENVIRONMENT_URL}/${id}`);
  return r.data;
}

export {
  createNewEnvironment,
  getAllEnvironments,
  getEnvironment,
  deleteAllEnvironments,
  deleteEnvironment,
  updateEnvironment
}