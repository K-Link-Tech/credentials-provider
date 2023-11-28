interface INewEnvironment {
  name: string;
  project_id: string;
}

interface IUpdateEnvironment {
  name: string;
}

interface IEnvironment extends INewEnvironment{
  id: string;
  createdAt: string;
  updatedAt: string;
}