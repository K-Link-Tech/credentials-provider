import { ALL_PROJECTS_URL, ONE_PROJECT_URL } from "@/utils/constants";
import api from "./axios";

const getAllProjects = async () => {
  const r = await api.get(ALL_PROJECTS_URL);
  return r.data;
}

const getProject = async (id: string) => {
  const r = await api.get(`${ONE_PROJECT_URL}/${id}`);
  return r.data;
}

const deleteAllProjects = async () => {
  const r = await api.delete(ALL_PROJECTS_URL);
  return r.data;
}

const deleteProject = async (id: string) => {
  const r = await api.delete(`${ONE_PROJECT_URL}/${id}`);
  return r.data;
}

const updateProject = async (id: string) => {
  const r = await api.patch(`${ONE_PROJECT_URL}/${id}`);
  return r.data;
}

export {
  getAllProjects,
  getProject,
  deleteAllProjects,
  deleteProject,
  updateProject
}