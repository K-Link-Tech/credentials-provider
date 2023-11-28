import { StateCreator } from "zustand";
import { IEnvKeyValueData } from "../interfaces/IEnvKeyValueData";

const createEnvKeyValueSlice: StateCreator<IEnvKeyValueData> = (set) => ({
  envKeyValue: {
    id: "",
    key: "",
    value: "",
    environment_id: "",
    encryption_method: "",
    createdAt: "",
    updatedAt: ""
  },
  setEnvKeyValue: (envKeyValueObj: IEnvKeyValue) => set((state: IEnvKeyValueData) => ({...state, envKeyValue: envKeyValueObj})),
  envKeyValueModalOpen: false,
  setEnvKeyValueModalOpen: (value: boolean) => set(() => ({ envKeyValueModalOpen: value})),
  envKeyValueModalError: "",
  setEnvKeyValueModalError: (value: string) => set(() => ({ envKeyValueModalError: value })),
  clearEnvKeyValueModalError: () => set(() => ({ envKeyValueModalError: "" }))
});

export {
  createEnvKeyValueSlice
};