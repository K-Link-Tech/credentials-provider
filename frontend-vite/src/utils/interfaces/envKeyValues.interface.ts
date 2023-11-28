interface INewEnvKeyValue {
  key: string;
  value: string;
  encryption_method: string;
  environment_id: string;
}

interface IUpdateEnvKeyValue {
  key?: string;
  value?: string;
  encryption_method: string;
}

interface IEnvKeyValue extends INewEnvKeyValue{
  id: string
  createdAt: string;
  updatedAt: string;
}