
export const QUERY_KEY = {
  users: ["users"],
  projects: ["projects"],
  environments: ["environments"],
  envKeyVals: ["environmentValues"]
} as const;

export const usersQuery = {
  key: (id: string): ['users', string] => ['users', id],
}
export const projectsQuery = {
  key: (id: string): ['projects', string] => ['projects', id],
}
export const environmentsQuery = {
  key: (id: string): ['environments', string] => ['environments', id],
}
export const envKeyValuesQuery = {
  key: (id: string): ['environmentValues', string] => ['environmentValues', id],
}
