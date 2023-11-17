import { createNewProject } from "@/api/projects";
import NewProjectForm from "@/components/forms/NewProjectForm";
import { Button } from "@/components/ui/button";
import { QUERY_KEY } from "@/utils/keys.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const queryClient = useQueryClient();

  const mutation = useMutation({
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
    mutation.mutate(projectData);
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
