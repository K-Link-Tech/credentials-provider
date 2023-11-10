import { StateCreator } from "zustand";
import { IProjectData } from "../interfaces/IProjectData";

const createProjectSlice: StateCreator<IProjectData> = (set) => ({
  project: {
    id: "",
    name: "",
    url: "",
    createdAt: "",
    updatedAt: ""
  },
  setProject: (projObj: IProject) => set((state: IProjectData) => ({...state, project: projObj}))
});

export {
  createProjectSlice
};