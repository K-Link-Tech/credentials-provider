export interface IProjectData {
  project: IProject;
  setProject: (value: IProject) => void;
  projectModalOpen: boolean;
  setProjectModalOpen: (value: boolean) => void;
  projectModalError: string;
  setProjectModalError: (value: string) => void;
  clearProjectModalError: () => void;
}

