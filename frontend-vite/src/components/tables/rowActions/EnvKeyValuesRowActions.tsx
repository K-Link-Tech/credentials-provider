import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { deleteEnvKeyValue } from "@/api/envkeyvalues";
import { envKeyValuesQuery } from "@/utils/keys.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import useStore from "@/store/useStore";

interface RowActionsProps {
  environmentId: string;
  envKeyValue: IEnvKeyValue;
  rowId: string;
}

export const EnvKeyValuesRowActions: React.FC<RowActionsProps> = (props) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const setModal = useStore((state) => state.setEnvKeyValueModalOpen);
  const setEnvKeyValue = useStore((state) => state.setEnvKeyValue);
  
  const deleteEnvKeyValueMutation = useMutation({
    mutationFn: deleteEnvKeyValue,
    onSuccess: (r) => {
      console.log("Deleted EnvKeyValue: ", r);
      queryClient.invalidateQueries({ queryKey: envKeyValuesQuery.key(props.environmentId) })
    },
    onError: (error) => {
      console.log(error);
      showBoundary(error);
    }
  });

  const handleOnClickUpdate = () => {
    setModal(true);
    setEnvKeyValue(props.envKeyValue);
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
          Copy Env Key Value pair ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteEnvKeyValueMutation.mutate(props.rowId)}
        >
          Delete Env Key Value pair
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleOnClickUpdate}
        >
          Edit Env Key Value pair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

