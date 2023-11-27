import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export default function EnvKeyValuesTable<TData>({
  data,
  columns,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  environmentId: string;
}) {

  const finalData  = useMemo(()=> data, [data]);
  const finalColumns  = useMemo(()=> columns, [columns]);

  const table = useReactTable({
    data: finalData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log("envKeyValuesData", data);

  return (
    <table className="overflow-hidden min-w-full table-auto border-collapse shadow-xl box-content rounded-xl m-auto overflow-x-auto">
      <thead className="bg-slate-300">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="p-4"
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
            <tr className="hover:bg-gray-100" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className="p-4 text-center border-t-2 border-solid border-slate-100 overflow-hidden text-ellipsis"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
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
