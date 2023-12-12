import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { Link } from "react-router-dom";
import { EnvKeyValuesRowActions } from "./rowActions/EnvKeyValuesRowActions";
import { EnvironmentsRowActions } from "./rowActions/EnvironmentsRowActions";
import { ProjectsRowActions } from "./rowActions/ProjectsRowActions";
import { UsersRowActions } from "./rowActions/UsersRowActions";

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
    header: "Actions",
    cell: ({ row }) => <UsersRowActions rowId={row.original.id} />,
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
        className="hover:underline"
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
  projectColumnHelper.accessor("scope", {
    header: () => "Scope",
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
    header: "Actions",
    cell: ({ row }) => (
      <ProjectsRowActions project={row.original} rowId={row.original.id} />
    ),
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
        className="hover:underline"
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
  environmentColumnHelper.display({
    header: "Actions",
    cell: ({ row }) => (
      <EnvironmentsRowActions
        environment={row.original}
        rowId={row.original.id}
        projectId={row.original.project_id}
      />
    ),
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
  envKeyValuesColumnHelper.display({
    header: "Actions",
    cell: ({ row }) => (
      <EnvKeyValuesRowActions
        rowId={row.original.id}
        envKeyValue={row.original}
        environmentId={row.original.environment_id}
      />
    ),
  }),
];

export { userColumns, projectColumns, environmentColumns, envKeyValuesColumns };
