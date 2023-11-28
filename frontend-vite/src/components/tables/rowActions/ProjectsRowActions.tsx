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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { deleteProject } from "@/api/projects";
import { QUERY_KEY } from "@/utils/keys.constants";
import useStore from "@/store/useStore";

interface RowActionsProps {
  project: IProject;
  rowId: string;
}

export const ProjectsRowActions: React.FC<RowActionsProps> = (props) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const setModal = useStore((state) => state.setProjectModalOpen);
  const setProj = useStore((state) => state.setProject);

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

  const handleOnClickUpdate = () => {
    setModal(true);
    setProj(props.project);
  }

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
        <DropdownMenuItem
          onClick={() => deleteProjectMutation.mutate(props.rowId)}
        >
          Delete Project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleOnClickUpdate}
        >
          Edit Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
