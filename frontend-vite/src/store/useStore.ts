import { create } from "zustand";
import { createUserSlice } from "./slices/userSlice";
import { IUserData } from "./interfaces/IUserData";
import { createProjectSlice } from "./slices/projectSlice";
import { IProjectData } from "./interfaces/IProjectData";
import { createEnvironmentSlice } from "./slices/environmentSlice";
import { IEnvironmentData } from "./interfaces/IEnvironmentData";
import { createEnvKeyValueSlice } from "./slices/envKeyValueSlice";
import { IEnvKeyValueData } from "./interfaces/IEnvKeyValueData";
import { createAuthSlice } from "./slices/authSlice";
import { IAuthData } from "./interfaces/IAuthData";
import { persist } from 'zustand/middleware';

interface ICombinedStorage
  extends IUserData,
    IProjectData,
    IEnvironmentData,
    IEnvKeyValueData,
    IAuthData {}

const useStore = create<ICombinedStorage>()(
  persist((...a) => ({
  ...createUserSlice(...a),
  ...createProjectSlice(...a),
  ...createEnvironmentSlice(...a),
  ...createEnvKeyValueSlice(...a),
  ...createAuthSlice(...a)
  }), {
    name: "Auth_Store",
    getStorage: () => localStorage,
    partialize: (state) => ({
      loginStatus: state.loginStatus,
      userId: state.userId
    }), 
  }));

export default useStore;
