import { StateCreator } from "zustand";
import { IEnvironmentData } from "../interfaces/IEnvironmentData";

const createEnvironmentSlice: StateCreator<IEnvironmentData> = (set) => ({
  environment: {
    id: "",
    name: "",
    project_id: "",
    createdAt: "",
    updatedAt: ""
  },
  setEnvironment: (environmentObj: IEnvironment) => set((state: IEnvironmentData) => ({...state, environment: environmentObj}))
});

export {
  createEnvironmentSlice
};