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
    <section className="py-10 rounded-xl justify-center bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium text-center">Data</h2>
      </div>
      <div  className="pt-4">
        <Tabs defaultValue="projects">
          <TabsList className="w-full justify-evenly rounded-2xl">
            <TabsTrigger value="projects" className="w-full rounded-2xl">
              Projects
            </TabsTrigger>
            <TabsTrigger value="users" className="w-full rounded-2xl">
              Users
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="projects"
            className="flex-col flex mx-auto space-y-4">
            <ProjectsTable data={projectsData} columns={projectColumns} />
            <Button onClick={() => navigate("/home/proj/create")}>
              Add New Project
            </Button>
          </TabsContent>
          <TabsContent value="users">
            <UsersTable data={userData} columns={userColumns} />
          </TabsContent>
        </Tabs>
      </div>
      {projectModalOpen && <ProjectModal onUpdateProject={updateProjectHandler} userRole={userRole} />}
    </section>
  );
};

export default Dashboard;
