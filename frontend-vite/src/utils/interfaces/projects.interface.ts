interface INewProject {
  name: string;
  url: string;
}

interface IUpdateProject {
  name?: string;
  url?: string;
}

interface IProject extends INewProject{
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface IGetProjectsData {
  message: string;
  projectsData: IProject[];
  authData: IAuthData;
}