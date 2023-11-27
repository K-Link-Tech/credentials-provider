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
  setProject: (projObj: IProject) => set((state: IProjectData) => ({...state, project: projObj})),
  projectModalOpen: false,
  setProjectModalOpen: (value: boolean) => set(() => ({ projectModalOpen: value})),
  projectModalError: "",
  setProjectModalError: (value: string) => set(() => ({ projectModalError: value })),
  clearProjectModalError: () => set(() => ({ projectModalError: "" }))
});

export {
  createProjectSlice
};