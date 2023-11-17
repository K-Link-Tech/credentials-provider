import { create } from "zustand";
import { createUserSlice } from "./slices/userSlice";
import { IUserData } from "./interfaces/IUserData";
import { createProjectSlice } from "./slices/projectSlice";
import { IProjectData } from "./interfaces/IProjectData";
import { createEnvironmentSlice } from "./slices/environmentSlice";
import { IEnvironmentData } from "./interfaces/IEnvironmentData";

const useStore = create<IUserData & IProjectData & IEnvironmentData>()((...a)=> ({
  ...createUserSlice(...a),
  ...createProjectSlice(...a),
  ...createEnvironmentSlice(...a)
}))

export default useStore;