import { create } from "zustand";
import { createUserSlice } from "./slices/userSlice";
import { IUserData } from "./interfaces/IUserData";
import { createProjectSlice } from "./slices/projectSlice";
import { IProjectData } from "./interfaces/IProjectData";
import { createEnvironmentSlice } from "./slices/environmentSlice";
import { IEnvironmentData } from "./interfaces/IEnvironmentData";
import { createEnvKeyValueSlice } from "./slices/envKeyValueSlice";
import { IEnvKeyValueData } from "./interfaces/IEnvKeyValueData";

const useStore = create<IUserData & IProjectData & IEnvironmentData & IEnvKeyValueData>()((...a)=> ({
  ...createUserSlice(...a),
  ...createProjectSlice(...a),
  ...createEnvironmentSlice(...a),
  ...createEnvKeyValueSlice(...a)
}))

export default useStore;