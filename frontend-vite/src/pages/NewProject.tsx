import { useNavigate } from "react-router-dom";
import { createNewProject } from "@/api/projects";
import { QUERY_KEY } from "@/utils/keys.constants";
import { useErrorBoundary } from "react-error-boundary";
import NewProjectForm from "@/components/forms/NewProjectForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewProject: React.FC = () => {
  
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const queryClient = useQueryClient();
  const createProject = useMutation({
    mutationFn: createNewProject,
    onSuccess: (r) => {
      console.log("New Proj result: ", r);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.projects })
      navigate("/home");
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

  const addProjectHandler = async (projectData: INewProject) => {
    console.log("posting backend...");
    createProject.mutate(projectData);
  };

  return (
    <section className="flex-col w-fit justify-center items-center space-y-10 mx-auto">
      <h1 className="text-white w-full text-6xl font-semibold">
        Add New Project
      </h1>
      <NewProjectForm onAddProject={addProjectHandler} />
    </section>
  );
};

export default NewProject;
