import { ALL_ENVIRONMENTS_URL, ONE_ENVIRONMENT_URL } from "@/utils/constants";
import api from "./axios";

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
  getAllEnvironments,
  getEnvironment,
  deleteAllEnvironments,
  deleteEnvironment,
  updateEnvironment
}