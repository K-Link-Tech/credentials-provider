export interface IUserData {
  userId: string;
  setUserId: (value: string) => void;
  user: IUser;
  setUser: (value: IUser) => void;
}