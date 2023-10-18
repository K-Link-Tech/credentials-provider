import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import { GET_ALL_USERS_URL, GET_USER_URL } from "../../utils/constants";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin";
};
interface ICurrentUser {
  user: User;
}

const UsersTable: React.FC<ICurrentUser> = (props) => {
  const emptyUsers: User[] = [];

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(emptyUsers);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        props.user.role === "admin"
          ? GET_ALL_USERS_URL
          : `${GET_USER_URL}${props.user.id}`
      )
      .then((r) => {
        console.log(r);
        setData(r.data.usersData);
        console.log("data fetched", data);
        console.log("data fetched size", data.length.valueOf());
        setIsLoading(false);
        console.log("loading state", isLoading);
      });
  }, []);

  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: () => "Id",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("email", {
      header: () => "Email",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("password", {
      header: () => "Password",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("createdAt", {
      header: () => "Created At",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("updatedAt", {
      header: () => "Updated At",
      cell: (info) => {
        info.getValue();
      },
    }),
    columnHelper.accessor("role", {
      header: () => "Role",
      cell: (info) => {
        info.getValue();
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading == true || data.length.valueOf() <= 0) {
    console.log("loading data", data);
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  console.log("Loading skipped", isLoading);

  return (
    <table className="border-2 border-solid border-black min-w-full">
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
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td className="p-4" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
