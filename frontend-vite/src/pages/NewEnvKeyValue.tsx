import { useErrorBoundary } from "react-error-boundary";
import { createNewEnvKeyValue } from "@/api/envkeyvalues";
import { useNavigate, useParams } from "react-router-dom";
import { envKeyValuesQuery } from "@/utils/keys.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NewEnvKeyValueForm from "@/components/forms/NewEnvKeyValueForm";

const NewEnvKeyValue: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  
  const queryClient = useQueryClient();

  const { environmentId } = useParams();

  const createEnvKeyValue = useMutation({
    mutationFn: createNewEnvKeyValue,
    onSuccess: (r) => {
      console.log("New Env Key Value pair result: ", r);
      queryClient.invalidateQueries({ queryKey: envKeyValuesQuery.key(environmentId as string) });
      navigate(`/home/env/${environmentId}`);
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

  const addEnvKeyValueHandler = async (envKeyValueData: INewEnvKeyValue) => {
    console.log("posting backend...");
    createEnvKeyValue.mutate(envKeyValueData);
  };

  return (
    <section className="flex-col w-fit justify-center items-center mx-auto">
      <h1 className="text-white w-full text-6xl pb-12 font-semibold">
        Add New Environment
      </h1>
      <NewEnvKeyValueForm onAddEnvKeyValue={addEnvKeyValueHandler} />
    </section>
  );
};

export default NewEnvKeyValue;
