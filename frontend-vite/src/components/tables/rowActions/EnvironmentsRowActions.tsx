import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { envKeyValuesQuery, environmentsQuery } from "@/utils/keys.constants";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { deleteEnvironment } from "@/api/environments";
import useStore from "@/store/useStore";
import DownloadButton from "@/components/download/DownloadButton";
import { getEnvKeyValue } from "@/api/envkeyvalues";

const retrieveEnvKeyValues = (id: string): UseQueryResult<any, Error> => {
  let envKeyValueQueryObj: UseQueryResult<any, Error>;
  envKeyValueQueryObj = useQuery({
    queryKey: envKeyValuesQuery.key(id),
    queryFn: () => getEnvKeyValue(id),
  });
  return envKeyValueQueryObj;
};

interface RowActionsProps {
  projectId: string,
  environment: IEnvironment,
  rowId: string
}

export const EnvironmentsRowActions: React.FC<RowActionsProps> = (props) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const setModal = useStore((state) => state.setEnvironmentModalOpen);
  const setEnvironment = useStore((state) => state.setEnvironment);
  
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

  let envKeyValuesRetrieved: UseQueryResult<any, Error>;
  let envKeyValuesData: IEnvKeyValue[] = [];
  envKeyValuesRetrieved = retrieveEnvKeyValues(props.rowId);
  if (envKeyValuesRetrieved.data !== undefined) {
    const queriedEnvKeyValuesData = envKeyValuesRetrieved.data;
    envKeyValuesData = queriedEnvKeyValuesData.envKeyValueData;
  }

  const handleOnClickUpdate = () => {
    setModal(true);
    setEnvironment(props.environment);
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
          Copy Environment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteEnvironmentMutation.mutate(props.rowId)}
        >
          Delete Environment
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleOnClickUpdate}
        >
          Edit Environment
        </DropdownMenuItem>
        <DownloadButton fileName={props.environment.name} jsonData={envKeyValuesData}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

