
export const QUERY_KEY = {
  users: ["users"],
} as const;

export const usersQuery = {
  key: (id: string): ['users', string] => ['users', id],
}
