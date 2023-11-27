import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { environmentsQuery } from "@/utils/keys.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { deleteEnvironment } from "@/api/environments";

interface RowActionsProps {
  projectId: string,
  rowId: string
}

export const EnvironmentsRowActions: React.FC<RowActionsProps> = (props) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  
  const deleteEnvironmentMutation = useMutation({
    mutationFn: deleteEnvironment,
    onSuccess: (r) => {
      console.log("Deleted environment: ", r);
      queryClient.invalidateQueries({ queryKey: environmentsQuery.key(props.projectId) });
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

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
          Copy Env Key Value pair ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteEnvironmentMutation.mutate(props.rowId)}
        >
          Delete Env Key Value pair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

