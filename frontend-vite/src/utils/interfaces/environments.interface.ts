interface INewEnvironment {
  name: string;
  project_id: string;
}
interface IEnvironment extends INewEnvironment{
  id: string;
  createdAt: string;
  updatedAt: string;
}