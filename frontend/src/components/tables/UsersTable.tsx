import { createColumnHelper, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { GET_ALL_USERS_URL, GET_USER_URL } from "../../utils/constants";

type usersObj = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  role: "user" | "admin";
};
const UsersTable: React.FC<usersObj> = (props) => {
  const emptyUsers: usersObj[] = [];

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(emptyUsers);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        props.role === "admin"
          ? GET_ALL_USERS_URL
          : `${GET_USER_URL}${props.id}`
      )
      .then((r) => {
        console.log(r);
        // const users: usersObj[] = [];

        // for (const key in r) {
        //   const user: usersObj = {
        //     id: key,
        //     ...r[key],
        //   };
        //   users.push(user);
        // }

        setIsLoading(false);
        // setLoadedUsers(r);
      });
  }, []);

  const columnHelper = createColumnHelper<usersObj>()

  const columns = [
    columnHelper.accessor('name', {
      cell: info => {info.getValue()}
    }),
    columnHelper.accessor('email', {
      cell: info => {info.getValue()}
    })
  ]

  const table = useReactTable({ data, columns });
  
  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return <div>BasicTable</div>;
};

export default UsersTable;
