import useStore from "@/store/useStore";
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
import { deleteEnvironment } from "@/api/environments";
import { environmentsQuery } from "@/utils/keys.constants";
import { useErrorBoundary } from "react-error-boundary";

export default function EnvironmentsTable<TData>({
  data,
  columns,
  projectId
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();

  
  const finalData = useMemo(() => data, [data]);
  const finalColumns = useMemo(() => columns, [columns]);

  const deleteEnvironmentMutation = useMutation({
    mutationFn: deleteEnvironment,
    onSuccess: (r) => {
      console.log("Deleted environment: ", r);
      queryClient.invalidateQueries({ queryKey: environmentsQuery.key(projectId) });
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    },
  });

  const table = useReactTable({
    data: finalData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log("environmentsData", data);

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
                      Copy environment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        deleteEnvironmentMutation.mutate(row.original?.id)
                      }
                    >
                      Delete environment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="h-24 text-center">
              No environments exist.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
