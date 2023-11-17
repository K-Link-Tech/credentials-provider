import { createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { Link } from "react-router-dom";

const userColumnHelper = createColumnHelper<IUser>();

const userColumns = [
  // columnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  userColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (row) => {
      return row.getValue();
    },
  }),
  userColumnHelper.accessor("role", {
    header: () => "Role",
    cell: (row) => {
      return row.getValue();
    },
  }),
  userColumnHelper.accessor("email", {
    header: () => "Email",
    cell: (row) => {
      return row.getValue();
    },
  }),
  // columnHelper.accessor("password", {
  //   header: () => "Password",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  userColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (row) => {
      const date = new Date(row.getValue());
      const formattedDate = moment(date).format("Do MMM YY, h:mm:ss a");
      return <div className="font-medium">{formattedDate}</div>;
    },
  }),
  userColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (row) => {
      const date = new Date(row.getValue());
      const formattedDate = moment(date).format("Do MMM YY, h:mm:ss a");
      return <div className="font-medium">{formattedDate}</div>;
    },
  }),
  userColumnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const projectColumnHelper = createColumnHelper<IProject>();

const projectColumns = [
  // columnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  projectColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (row) => (
      <Link
        to={{ pathname: "/home/proj/" + `${row.row.original.id}` }}
        className="p-1 ring-1 ring-black hover:underline hover:bg-sky-200 active:bg-sky-400"
      >
        {row.getValue()}
      </Link>
    ),
  }),
  projectColumnHelper.accessor("url", {
    header: () => "Url",
    cell: (row) => {
      return row.getValue();
    },
  }),
  projectColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (row) => {
      return row.getValue();
    },
  }),
  projectColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (row) => {
      return row.getValue();
    },
  }),
  projectColumnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy project ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const environmentColumnHelper = createColumnHelper<IEnvironment>();

const environmentColumns = [
  // environmentColumnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  environmentColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (row) => (
      <Link
        to={{ pathname: "/home/env/" + `${row.row.original.id}` }}
        className="p-1 ring-1 ring-black hover:underline hover:bg-sky-200 active:bg-sky-400"
      >
        {row.getValue()}
      </Link>
    ),
  }),
  // environmentColumnHelper.accessor("project_id", {
  //   header: () => "Project ID",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  environmentColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (row) => {
      return row.getValue();
    },
  }),
  environmentColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (row) => {
      return row.getValue();
    },
  }),
];

const envKeyValuesColumnHelper = createColumnHelper<IEnvKeyValue>();

const envKeyValuesColumns = [
  // envKeyValuesColumnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  envKeyValuesColumnHelper.accessor("key", {
    header: () => "Key",
    cell: (row) => {
      return row.getValue();
    },
  }),
  envKeyValuesColumnHelper.accessor("value", {
    header: () => "Value",
    cell: (row) => {
      return row.getValue();
    },
  }),
  envKeyValuesColumnHelper.accessor("encryption_method", {
    header: () => "Encryption Method",
    cell: (row) => {
      return row.getValue();
    },
  }),
  // envKeyValuesColumnHelper.accessor("environment_id", {
  //   header: () => "Environment ID",
  //   cell: (row) => {
  //     return row.getValue();
  //   },
  // }),
  envKeyValuesColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (row) => {
      return row.getValue();
    },
  }),
  envKeyValuesColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (row) => {
      return row.getValue();
    },
  }),
];


export { userColumns, projectColumns, environmentColumns, envKeyValuesColumns };
