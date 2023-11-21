import { UseQueryResult, useQuery } from "@tanstack/react-query";
import UsersTable from "@/components/tables/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectColumns, userColumns } from "@/components/tables/columns";
import ProjectsTable from "@/components/tables/ProjectsTable";
import useStore from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getUser } from "@/api/users";
import { QUERY_KEY, usersQuery } from "@/utils/keys.constants";
import { getAllProjects } from "@/api/projects";

const retrieveUsers = (
  role: string,
  id: string
): UseQueryResult<any, Error> => {
  let userQueryObj: UseQueryResult<any, Error>;
  if (role === "admin") {
    userQueryObj = useQuery({
      queryKey: QUERY_KEY.users,
      queryFn: getAllUsers,
    });
  } else {
    userQueryObj = useQuery({
      queryKey: usersQuery.key(id),
      queryFn: () => getUser(id),
    });
  }
  return userQueryObj;
};
const retrieveProjects = (): UseQueryResult<any, Error> => {
  let projectQueryObj: UseQueryResult<any, Error>;
  projectQueryObj = useQuery({
    queryKey: QUERY_KEY.projects,
    queryFn: getAllProjects,
  });
  return projectQueryObj;
};

const Dashboard: React.FC = () => {
  const userObj: IUser = useStore((state) => state.user);

  const navigate = useNavigate();

  let usersRetrieved: UseQueryResult<any, Error>;
  usersRetrieved = retrieveUsers(userObj.role, userObj.id);
  console.log("usersRetrieved: ", usersRetrieved);
  const userData: IUser[] =
    usersRetrieved.data === undefined ? [] : usersRetrieved.data.usersData;

  let projectsRetrieved: UseQueryResult<any, Error>;
  projectsRetrieved = retrieveProjects();
  const projectsData: IProject[] =
    projectsRetrieved.data === undefined
      ? []
      : projectsRetrieved.data.projectsData;
  console.log("projectsRetrieved: ", projectsRetrieved);

  if (usersRetrieved.isLoading == true || projectsRetrieved.isLoading == true) {
    return (
      <section className="flex items-center justify-center mx-auto my-auto">
        <p className="text-8xl text-white font-bold">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center space-y-5 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">Data</h2>
      </div>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="w-full justify-evenly rounded-2xl">
          <TabsTrigger value="users" className="w-full rounded-2xl">
            Users
          </TabsTrigger>
          <TabsTrigger value="projects" className="w-full rounded-2xl">
            Projects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTable data={userData} columns={userColumns} />
        </TabsContent>
        <TabsContent
          value="projects"
          className="flex-col flex mx-auto space-y-4"
        >
          <ProjectsTable data={projectsData} columns={projectColumns} />
          <Button onClick={() => navigate("/home/proj/create")}>
            Add New Project
          </Button>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Dashboard;
