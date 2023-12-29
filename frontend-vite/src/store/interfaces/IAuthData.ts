export interface IAuthData {
  loginStatus: boolean;
  setLogin: () => void;
  setLogout: () => void;
  loginErrorStatus: boolean;
  setLoginError: () => void;
  removeLoginError: () => void;
}