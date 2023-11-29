import { StateCreator } from "zustand";
import { IUserData } from "../interfaces/IUserData";

const createUserSlice: StateCreator<IUserData> = (set) => ({
  userId: "",
  setUserId: (id: string) => set(() => ({ userId: id })),
  user: {
    id: "",
    name: "",
    role: "",
    email: "",
    password: "",
    createdAt: "",
    updatedAt: ""
  },
  setUser: (userObj: IUser) => set((state: IUserData) => ({...state, user: userObj}))
});

export {
  createUserSlice
};