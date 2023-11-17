import { getEnvKeyValue } from "@/api/envkeyvalues";
import EnvKeyValuesTable from "@/components/tables/EnvKeyValuesTable";
import { envKeyValuesColumns, } from "@/components/tables/columns";
import useStore from "@/store/useStore";
import { envKeyValuesQuery } from "@/utils/keys.constants";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const retrieveEnvKeyValues = (id: string): UseQueryResult<any, Error> => {
  let envKeyValueQueryObj: UseQueryResult<any, Error>;
  envKeyValueQueryObj = useQuery({
    queryKey: envKeyValuesQuery.key(id),
    queryFn: () => getEnvKeyValue(id),
  });
  return envKeyValueQueryObj;
};

const Environment: React.FC = () => {
  const { environmentId } = useParams();
  const environmentObj: IEnvironment = useStore((state) => state.environment)

  let envKeyValuesRetrieved: UseQueryResult<any, Error>;
  let envKeyValuesData: IEnvKeyValue[] = [];
  if (environmentId) {
    envKeyValuesRetrieved = retrieveEnvKeyValues(environmentId);
    envKeyValuesData = envKeyValuesRetrieved.data === undefined ? [] : envKeyValuesRetrieved.data.environmentData;
    console.log("envKeyValuesRetrieved: ", envKeyValuesRetrieved);
  } else {
    throw new Error("Cannot find environment ID to get environments!");
  }

  if (envKeyValuesRetrieved.isLoading == true) {
    return (
      <section className="flex items-center justify-center mx-auto my-auto">
        <p className="text-8xl text-white font-bold">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center space-y-5 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">Environment {environmentObj.name} Env Key Values</h2>
      </div>
      <div>
        <EnvKeyValuesTable
          data={envKeyValuesData}
          columns={envKeyValuesColumns}
        />
      </div>
    </section>
  );
};

export default Environment;
