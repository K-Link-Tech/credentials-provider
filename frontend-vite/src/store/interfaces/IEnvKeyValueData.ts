export interface IEnvKeyValueData {
  envKeyValue: IEnvKeyValue;
  setEnvKeyValue: (value: IEnvKeyValue) => void;
  envKeyValueModalOpen: boolean;
  setEnvKeyValueModalOpen: (value: boolean) => void;
  envKeyValueModalError: string;
  setEnvKeyValueModalError: (value: string) => void;
  clearEnvKeyValueModalError: () => void;
}

