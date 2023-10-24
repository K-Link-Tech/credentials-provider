interface IUserLoginPayload {
  name: string;
  email: string;
}

interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface IGetUsersData {
  message: string;
  usersData: IUser[];
  authData: IAuthData;
}

