import { getEnvironment } from "@/api/environments";
import { getEnvKeyValue, updateEnvKeyValue } from "@/api/envkeyvalues";
import { EnvKeyValueModal } from "@/components/modals/EnvKeyValueModal";
import EnvKeyValuesTable from "@/components/tables/EnvKeyValuesTable";
import { envKeyValuesColumns } from "@/components/tables/columns";
import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { envKeyValuesQuery, environmentsQuery } from "@/utils/keys.constants";
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const retrieveEnvKeyValues = (id: string): UseQueryResult<any, Error> => {
  let envKeyValueQueryObj: UseQueryResult<any, Error>;
  envKeyValueQueryObj = useQuery({
    queryKey: envKeyValuesQuery.key(id),
    queryFn: () => getEnvKeyValue(id),
  });
  return envKeyValueQueryObj;
};

const retrieveEnvironment = (id: string): UseQueryResult<any, Error> => {
  let environmentQueryObj: UseQueryResult<any, Error>;
  environmentQueryObj = useQuery({
    queryKey: environmentsQuery.key(id),
    queryFn: () => getEnvironment(id),
  });
  return environmentQueryObj;
};

const Environment: React.FC = () => {
  const { environmentId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();

  const envKeyValueObj = useStore((state) => state.envKeyValue);
  const envKeyValueModalOpen = useStore((state) => state.envKeyValueModalOpen);

  const handleOnClickButton: React.MouseEventHandler = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    navigate(`/home/env/${environmentId}/envkeys/create`);
  };

  let envKeyValuesRetrieved: UseQueryResult<any, Error>;
  let environmentsRetrieved: UseQueryResult<any, Error>;
  let envKeyValuesData: IEnvKeyValue[] = [];
  let environmentsData: IEnvironment[] = [];

  if (environmentId) {
    environmentsRetrieved = retrieveEnvironment(environmentId);
    if (environmentsRetrieved.data !== undefined) {
      const queriedEnvironmentsData = environmentsRetrieved.data;
      environmentsData = queriedEnvironmentsData.environmentData;
    }

    envKeyValuesRetrieved = retrieveEnvKeyValues(environmentId);
    if (envKeyValuesRetrieved.data !== undefined) {
      const queriedEnvKeyValuesData = envKeyValuesRetrieved.data;
      envKeyValuesData = queriedEnvKeyValuesData.envKeyValueData;
    }
    console.log("envKeyValuesRetrieved: ", envKeyValuesRetrieved);
  } else {
    throw new Error("Cannot find environment ID to get env key value pairs!");
  }

  let updateEnvKeyValueMutation: UseMutationResult<any, Error, IUpdateEnvKeyValue, unknown>;
  updateEnvKeyValueMutation = useMutation({
    mutationFn: (envKeyValueData: IUpdateEnvKeyValue) => updateEnvKeyValue(envKeyValueObj.id, envKeyValueData),
    onSuccess: (r) => {
      console.log("Updated Env Key Value result: ", r);
      queryClient.invalidateQueries({ queryKey: envKeyValuesQuery.key(environmentId) })
    },
    onError: (error) => {
      console.error("Update Env Key Value Error: ", error);
      showBoundary(error);
    }
  });
  const updateEnvKeyValueHandler = async (envKeyValueData: IUpdateEnvKeyValue) => {
    console.log("posting backend...");
    updateEnvKeyValueMutation.mutate(envKeyValueData);
  };

  if (
    envKeyValuesRetrieved.isLoading == true ||
    environmentsRetrieved.isLoading == true
  ) {
    return (
      <section className="flex flex-col justify-center">
      <div role="status" className="items-center mt-40 mb-10 mx-auto">
        <svg
          aria-hidden="true"
          className="inline w-40 h-40 text-gray-600 animate-spin dark:text-gray-200 fill-gray-300 dark:fill-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only text-black">Loading...</span>
      </div>
      <p className="text-6xl text-black font-bold mx-auto">Loading...</p>
    </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center space-y-4 bg-white align-element">
      <Button
        onClick={() => navigate(`/home/proj/${environmentsData[0].project_id}`)}
      >
        Back
      </Button>
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">
          Environment {environmentsData[0].name} Env Key Values
        </h2>
      </div>
      <EnvKeyValuesTable
        data={envKeyValuesData}
        columns={envKeyValuesColumns}
        environmentId={environmentId}
      />
      <Button className="w-full" onClick={handleOnClickButton}>
        Add New Env Key Value pair
      </Button>
      {envKeyValueModalOpen && <EnvKeyValueModal onUpdateEnvKeyValue={updateEnvKeyValueHandler}/>}
    </section>
  );
};

export default Environment;
