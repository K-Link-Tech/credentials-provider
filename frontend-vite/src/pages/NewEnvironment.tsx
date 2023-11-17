import { createNewEnvironment } from "@/api/environments";
import NewEnvironmentForm from "@/components/forms/NewEnvironmentForm";
import { environmentsQuery } from "@/utils/keys.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";

const NewEnvironment: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const { projId } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewEnvironment,
    onSuccess: (r) => {
      console.log("New Environment result: ", r);
      queryClient.invalidateQueries({ queryKey: environmentsQuery.key(projId as string) });
      navigate(`/home/proj/${projId}`);
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

  const addEnvironmentHandler = async (environmentData: INewEnvironment) => {
    console.log("posting backend...");
    mutation.mutate(environmentData);
  };

  return (
    <section className="flex-col w-fit justify-center items-center mx-auto">
      <h1 className="text-white w-full text-6xl pb-12 font-semibold">
        Add New Environment
      </h1>
      <NewEnvironmentForm onAddEnvironment={addEnvironmentHandler} />
    </section>
  );
};

export default NewEnvironment;
