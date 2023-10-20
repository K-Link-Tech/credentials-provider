import UsersTable from "../components/tables/UsersTable";
import { createColumnHelper } from "@tanstack/react-table";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
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

const columnHelper = createColumnHelper<User>();

const columns = [
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
  columnHelper.accessor("role", {
    header: () => "Role",
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
];

const Dashboard: React.FC = () => {
  const userStringObj = localStorage.getItem("user");
  const userObj: User = userStringObj && JSON.parse(userStringObj);
  let queryObj: UseQueryResult<any, Error>;
  if (userObj.role === "admin") {
    queryObj = useQuery({
      queryKey: QUERY_KEY.users,
      queryFn: getAllUsers,
    });
  } else {
    queryObj = useQuery({
      queryKey: usersQuery.key(userObj.id),
      queryFn: () => getUser(userObj.id),
    });
  }

  if (queryObj.isLoading == true) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }
  return (
    <section className="py-20 rounded-xl justify-center space-y-10 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium">Projects</h2>
      </div>
      <div className="">
        <UsersTable data={queryObj.data.usersData} columns={columns} />
      </div>
    </section>
  );
};

export default Dashboard;
