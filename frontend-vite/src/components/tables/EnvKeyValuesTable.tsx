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
}) {
  const finalData  = useMemo(()=> data, []);
  const finalColumns  = useMemo(()=> columns, []);

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
                className="px-1 py-1 border-b-2 border-b-gray-500 border-r-2 border-r-gray-500 last:border-r-0"
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
