interface IProject {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface IGetProjectsData {
  message: string;
  projectsData: IProject[];
  authData: IAuthData;
}