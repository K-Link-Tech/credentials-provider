import { create } from "zustand";
import { createUserSlice } from "./slices/userSlice";
import { IUserData } from "./interfaces/IUserData";
import { createProjectSlice } from "./slices/projectSlice";
import { IProjectData } from "./interfaces/IProjectData";

const useStore = create<IUserData & IProjectData>()((...a)=> ({
  ...createUserSlice(...a),
  ...createProjectSlice(...a)
}))

export default useStore;