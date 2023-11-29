import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { deleteProject } from "@/api/projects";
import { QUERY_KEY, usersQuery } from "@/utils/keys.constants";
import useStore from "@/store/useStore";
import { getUser } from "@/api/users";

const emptyAuthData: IAuthData = {
  id: "",
  name: "",
  email: "",
  role: "",
  exp: "",
  iss: "",
  iat: "",
};

const retrieveUser = (id: string): UseQueryResult<any, Error> => {
  let userQueryObj: UseQueryResult<any, Error>;
  userQueryObj = useQuery({
    queryKey: usersQuery.key(id),
    queryFn: () => getUser(id),
  });
  return userQueryObj;
};

interface RowActionsProps {
  project: IProject;
  rowId: string;
}

export const ProjectsRowActions: React.FC<RowActionsProps> = (props) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const setModal = useStore((state) => state.setProjectModalOpen);
  const setProj = useStore((state) => state.setProject);
  const userId = useStore((state) => state.userId);

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (r) => {
      console.log("Deleted project: ", r);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.projects });
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

  const hasRights = (role: string, scope: string): boolean => {
    if (role === "admin") {
      return true;
    }
    return role === scope;
  };

  const handleOnClickUpdate = () => {
    setModal(true);
    setProj(props.project);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(props.rowId)}
        >
          Copy Project ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {hasRights(role, props.project.scope) && <DropdownMenuItem
          onClick={() => deleteProjectMutation.mutate(props.rowId)}
        >
          Delete Project
        </DropdownMenuItem>}
        {hasRights(role, props.project.scope) && <DropdownMenuItem onClick={handleOnClickUpdate}>
          Edit Project
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
