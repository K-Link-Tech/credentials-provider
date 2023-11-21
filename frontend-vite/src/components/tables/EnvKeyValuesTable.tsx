import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEnvKeyValue } from "@/api/envkeyvalues";
import { useErrorBoundary } from "react-error-boundary";
import { envKeyValuesQuery } from "@/utils/keys.constants";

export default function EnvKeyValuesTable<TData>({
  data,
  columns,
  environmentId,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  environmentId: string;
}) {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();

  const finalData  = useMemo(()=> data, [data]);
  const finalColumns  = useMemo(()=> columns, [columns]);

  const deleteEnvKeyValueMutation = useMutation({
    mutationFn: deleteEnvKeyValue,
    onSuccess: (r) => {
      console.log("Deleted EnvKeyValue: ", r);
      queryClient.invalidateQueries({ queryKey: envKeyValuesQuery.key(environmentId) })
    },
    onError: (error) => {
      console.log(error);
      showBoundary(error);
    }
  })

  const table = useReactTable({
    data: finalData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log("envKeyValuesData", data);

  return (
    <table className="border-collapse border-2 border-solid border-black min-w-full table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="px-1 py-1 border-b-2 border-b-gray-500 border-r-2 border-r-gray-500 last:border-r-2"
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
      {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className="px-2 py-2 text-center border-black border-b-2 border-r-2 last:border-r-0"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {/* Action Column */}
              <td className="px-2 py-2 text-center border-black border-b-2 border-r-2 last:border-r-0 border-t-2">
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
                      onClick={() =>
                        navigator.clipboard.writeText(row.original?.id)
                      }
                    >
                      Copy Env Key Value pair ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        deleteEnvKeyValueMutation.mutate(row.original?.id)
                      }
                    >
                      Delete Env Key Value pair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No env key value pairs exist.
              </td>
            </tr>
          )}
      </tbody>
    </table>
  );
}
