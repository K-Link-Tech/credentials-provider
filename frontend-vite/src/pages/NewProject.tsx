import { useNavigate } from "react-router-dom";
import { createNewProject } from "@/api/projects";
import { QUERY_KEY, usersQuery } from "@/utils/keys.constants";
import { useErrorBoundary } from "react-error-boundary";
import NewProjectForm from "@/components/forms/NewProjectForm";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/api/users";
import useStore from "@/store/useStore";

const emptyAuthData: IAuthData = {
  id: "",
  name: "",
  email: "",
  role: "",
  exp: "",
  iss: "",
  iat: ""
}

const retrieveUser = (id: string): UseQueryResult<any, Error> => {
  let userQueryObj: UseQueryResult<any, Error>;
  userQueryObj = useQuery({
    queryKey: usersQuery.key(id),
    queryFn: () => getUser(id),
  });
  return userQueryObj;
};

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const queryClient = useQueryClient();
  const userId = useStore((state) => state.userId);

  const createProject = useMutation({
    mutationFn: createNewProject,
    onSuccess: (r) => {
      console.log("New Proj result: ", r);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.projects });
      navigate("/home");
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

  let userObj: UseQueryResult<any, Error>;
  userObj = retrieveUser(userId);
  const userObjData: IAuthData =
    userObj.data === undefined ? emptyAuthData : userObj.data.authData;
  const { role } = userObjData as IAuthData;

  const addProjectHandler = async (projectData: INewProject) => {
    console.log("posting backend...");
    createProject.mutate(projectData);
  };

  return (
    <section className="flex-col w-fit justify-center items-center space-y-10 mx-auto">
      <h1 className="text-white w-full text-6xl font-semibold">
        Add New Project
      </h1>
      <NewProjectForm onAddProject={addProjectHandler} userRole={role} />
    </section>
  );
};

export default NewProject;
