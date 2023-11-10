import { getEnvironment } from "@/api/environments";
import EnvironmentsTable from "@/components/tables/EnvironmentsTable";
import { environmentColumns } from "@/components/tables/columns";
import useStore from "@/store/useStore";
import { environmentsQuery } from "@/utils/keys.constants";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const retrieveEnvironments = (id: string): UseQueryResult<any, Error> => {
  let environmentQueryObj: UseQueryResult<any, Error>;
  environmentQueryObj = useQuery({
    queryKey: environmentsQuery.key(id),
    queryFn: () => getEnvironment(id),
  });
  return environmentQueryObj;
};

const Project: React.FC = () => {
  const { projId } = useParams();
  const projObj: IProject = useStore((state) => state.project)

  let environmentsRetrieved: UseQueryResult<any, Error>;
  if (projId) {
    environmentsRetrieved = retrieveEnvironments(projId);
    console.log("environmentsRetrieved: ", environmentsRetrieved);
  } else {
    throw new Error("Cannot find project ID to get environments!");
  }

  if (environmentsRetrieved.isLoading == true) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center space-y-5 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">Project: {projObj.name}</h2>
      </div>
      <div>
        <EnvironmentsTable
          data={environmentsRetrieved.data.environmentData}
          columns={environmentColumns}
        />
      </div>
    </section>
  );
};

export default Project;
