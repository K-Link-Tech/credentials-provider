import { getEnvironment } from "@/api/environments";
import { getProject } from "@/api/projects";
import EnvironmentsTable from "@/components/tables/EnvironmentsTable";
import { environmentColumns } from "@/components/tables/columns";
import { Button } from "@/components/ui/button";
import { environmentsQuery, projectsQuery } from "@/utils/keys.constants";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const retrieveEnvironments = (id: string): UseQueryResult<any, Error> => {
  let environmentQueryObj: UseQueryResult<any, Error>;
  environmentQueryObj = useQuery({
    queryKey: environmentsQuery.key(id),
    queryFn: () => getEnvironment(id),
  });
  return environmentQueryObj;
};
const retrieveProject = (id: string): UseQueryResult<any, Error> => {
  let projectQueryObj: UseQueryResult<any, Error>;
  projectQueryObj = useQuery({
    queryKey: projectsQuery.key(id),
    queryFn: () => getProject(id),
  });
  return projectQueryObj;
};

const Project: React.FC = () => {
  const { projId } = useParams();
  const navigate = useNavigate();

  const handleOnClickButton: React.MouseEventHandler = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    navigate(`/home/proj/${projId}/env/create`);
  };

  let retrieveProjectQueryObj: UseQueryResult<any, Error>;
  let environmentsRetrieved: UseQueryResult<any, Error>;
  let environmentsData: IEnvironment[] = [];
  let projectsData: IProject[] = [];

  if (projId) {
    retrieveProjectQueryObj = retrieveProject(projId);
    if (retrieveProjectQueryObj.data !== undefined) {
      const queriedProjectData = retrieveProjectQueryObj.data;
      projectsData = queriedProjectData.projectsData;
    }

    environmentsRetrieved = retrieveEnvironments(projId);
    environmentsData =
      environmentsRetrieved.data === undefined
        ? []
        : environmentsRetrieved.data.environmentData;
    console.log("environmentsRetrieved: ", environmentsRetrieved);
  } else {
    throw new Error("Cannot find project ID to get environments!");
  }

  if (environmentsRetrieved.isLoading == true || retrieveProjectQueryObj.isLoading) {
    return (
      <section className="flex items-center justify-center mx-auto my-auto">
        <p className="text-8xl text-white font-bold">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center space-y-4 bg-white align-element">
      <Button onClick={() => navigate("/home")}>Back</Button>
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">
          Project {projectsData[0].name} Environments
        </h2>
      </div>
      <EnvironmentsTable
        data={environmentsData}
        columns={environmentColumns}
        projectId={projId}
      />
      <Button className="w-full" onClick={handleOnClickButton}>
        Add New Environment
      </Button>
    </section>
  );
};

export default Project;
