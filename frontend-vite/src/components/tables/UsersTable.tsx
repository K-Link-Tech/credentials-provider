import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY, usersQuery } from "@/utils/keys.constants";
import { getAllUsers, getUser } from "@/api/users";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin";
};
type GetUsersResponseObj = {
  message: string;
  usersData: User[];
  authData: {
    id: string,
    name: string,
    email: string,
    role: string,
    iat: number,
    exp: number,
    iss: string
  }
}
interface ICurrentUser {
  user: User;
}

const UsersTable: React.FC<ICurrentUser> = (props) => {
  const emptyUsers: User[] = [];

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(emptyUsers);

  const queryAllUsers = useQuery({
    queryKey: QUERY_KEY.users,
    queryFn: getAllUsers
  })
  const queryUser = useQuery({
    queryKey: usersQuery.key(props.user.id),
    queryFn: () => getUser(props.user.id)
  })

  useEffect(() => {
    setIsLoading(true);
    if (props.user.role === "admin") {
      const { usersData } = queryAllUsers.data as GetUsersResponseObj;
      setData(usersData);
      setIsLoading(queryAllUsers.isLoading);
    } else {
      const { usersData } = queryUser.data as GetUsersResponseObj;
      setData(usersData);
      setIsLoading(queryUser.isLoading);
    }
    // axios
    //   .get(
    //     props.user.role === "admin"
    //       ? GET_ALL_USERS_URL
    //       : `${GET_USER_URL}${props.user.id}`
    //   )
    //   .then((r) => {
    //     console.log(r);
    //     setData(r.data.usersData);
    //     console.log("data fetched", data);
    //     console.log("data fetched size", data.length.valueOf());
    //     setIsLoading(false);
    //     console.log("loading state", isLoading);
    //   });
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
