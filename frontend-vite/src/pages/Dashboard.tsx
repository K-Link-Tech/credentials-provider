import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UsersTable from "@/components/tables/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectColumns, userColumns } from "@/components/tables/columns";
import ProjectsTable from "@/components/tables/ProjectsTable";
import useStore from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getUser } from "@/api/users";
import { QUERY_KEY, usersQuery } from "@/utils/keys.constants";
import { getAllProjects, updateProject } from "@/api/projects";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { useErrorBoundary } from "react-error-boundary";

const emptyAuthData: IAuthData = {
  id: "",
  name: "",
  email: "",
  role: "",
  exp: "",
  iss: "",
  iat: ""
}

const retrieveUsers = (
  role: string,
  id: string
): UseQueryResult<any, Error> => {
  let userQueryObj: UseQueryResult<any, Error>;
  // console.log("In retrieveUsers",role);
  // console.log("In retrieveUsers",id);
  if (role === "admin") {
    console.log("UserQuery function ALL HIT role: ",role);
    
    userQueryObj = useQuery({
      queryKey: QUERY_KEY.users,
      queryFn: getAllUsers,
    });
  } else {
    console.log("UserQuery function ONE HIT role: ",role);
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
  const { showBoundary } = useErrorBoundary();
  const queryClient = useQueryClient();
  
  const userId = useStore((state) => state.userId);
  console.log("userId", userId);
  let userObj: UseQueryResult<any, Error>;
  userObj = retrieveUsers("user", userId);
  console.log("UserObj: ", userObj);

  const userObjData: IAuthData  =
    userObj.data === undefined ? emptyAuthData : userObj.data.authData;
  console.log("UserObjData: ", userObjData);
  const { role } = userObjData as IAuthData;
  const userRole = role;

  const projObj: IProject = useStore((state) => state.project);
  const projectModalOpen: boolean = useStore((state) => state.projectModalOpen);

  const navigate = useNavigate();

  let usersRetrieved: UseQueryResult<any, Error>;
  usersRetrieved = retrieveUsers(userRole, userId);
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

  let updateProjectMutation: UseMutationResult<any, Error, IUpdateProject, unknown>;
  updateProjectMutation = useMutation({
    mutationFn: (projectData: IUpdateProject) => updateProject(projObj.id, projectData),
    onSuccess: (r) => {
      console.log("Updated Proj result: ", r);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.projects })
    },
    onError: (error) => {
      console.error("Update Project Error: ", error);
      showBoundary(error);
    }
  });
  const updateProjectHandler = async (projectData: IUpdateProject) => {
    console.log("posting backend...");
    updateProjectMutation.mutate(projectData);
  };

  if (usersRetrieved.isLoading == true || projectsRetrieved.isLoading == true) {
    return (
      <section className="flex items-center justify-center mx-auto my-auto">
        <p className="text-8xl text-white font-bold">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-10 rounded-xl justify-center bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">Data</h2>
      </div>
      <div  className="pt-4">
        <Tabs defaultValue="users">
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
            className="flex-col flex mx-auto space-y-4">
            <ProjectsTable data={projectsData} columns={projectColumns} />
            <Button onClick={() => navigate("/home/proj/create")}>
              Add New Project
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      {projectModalOpen && <ProjectModal onUpdateProject={updateProjectHandler} userRole={userRole} />}
    </section>
  );
};

export default Dashboard;
