import { createNewProject } from "@/api/projects";
import NewProjectForm from "@/components/forms/NewProjectForm";
import { useMutation } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const mutation = useMutation({
    mutationFn: createNewProject,
    onSuccess: (r) => {
      console.log("New Proj result: ", r);
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
    <section className="flex-col w-fit justify-center items-center mx-auto">
      <h1 className="text-white w-full text-6xl pb-12 font-semibold">
        Add New Project
      </h1>
      <NewProjectForm onAddProject={addProjectHandler} />
    </section>
  );
};

export default NewProject;
