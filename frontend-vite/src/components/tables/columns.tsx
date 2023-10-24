import { createColumnHelper } from "@tanstack/react-table";

const userColumnHelper = createColumnHelper<IUser>();

const userColumns = [
  // columnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (info) => {
  //     return info.getValue();
  //   },
  // }),
  userColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => {
      return info.getValue();
    },
  }),
  userColumnHelper.accessor("role", {
    header: () => "Role",
    cell: (info) => {
      return info.getValue();
    },
  }),
  userColumnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => {
      return info.getValue();
    },
  }),
  // columnHelper.accessor("password", {
  //   header: () => "Password",
  //   cell: (info) => {
  //     return info.getValue();
  //   },
  // }),
  userColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (info) => {
      return info.getValue();
    },
  }),
  userColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (info) => {
      return info.getValue();
    },
  }),
];

const projectColumnHelper = createColumnHelper<IProject>();

const projectColumns = [
  // columnHelper.accessor("id", {
  //   header: () => "Id",
  //   cell: (info) => {
  //     return info.getValue();
  //   },
  // }),
  projectColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => {
      return info.getValue();
    },
  }),
  projectColumnHelper.accessor("url", {
    header: () => "Url",
    cell: (info) => {
      return info.getValue();
    },
  }),
  projectColumnHelper.accessor("createdAt", {
    header: () => "Created At",
    cell: (info) => {
      return info.getValue();
    },
  }),
  projectColumnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (info) => {
      return info.getValue();
    },
  }),
];


export {
  userColumns,
  projectColumns
}