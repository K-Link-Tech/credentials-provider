
export const QUERY_KEY = {
  users: ["users"],
  projects: ["projects"],
  environments: ["environments"],
  envVals: ["environmentValues"]
} as const;

export const usersQuery = {
  key: (id: string): ['users', string] => ['users', id],
}
export const environmentsQuery = {
  key: (id: string): ['environments', string] => ['environments', id],
}
