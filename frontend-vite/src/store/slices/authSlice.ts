import { StateCreator } from "zustand";
import { IAuthData } from "../interfaces/IAuthData";

const createAuthSlice: StateCreator<IAuthData> = (set) => ({
  loginStatus: false,
  setLogin: () => set(() => ({ loginStatus: true })),
  setLogout: () => set(() => ({ loginStatus: false }))
});

export {
  createAuthSlice
};