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
      <section className="flex items-center justify-center mx-auto my-auto">
        <p className="text-8xl text-white font-bold">Loading...</p>
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
