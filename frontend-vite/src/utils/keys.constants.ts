
export const QUERY_KEY = {
  users: ["users"],
  projects: ["projects"]
} as const;

export const usersQuery = {
  key: (id: string): ['users', string] => ['users', id],
}
