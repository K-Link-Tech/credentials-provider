export interface IEnvironmentData {
  environment: IEnvironment;
  setEnvironment: (value: IEnvironment) => void;
  environmentModalOpen: boolean;
  setEnvironmentModalOpen: (value: boolean) => void;
  environmentModalError: string;
  setEnvironmentModalError: (value: string) => void;
  clearEnvironmentModalError: () => void;
}

