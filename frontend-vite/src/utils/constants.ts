// leading endpoints
export const BACKEND_API = `http://localhost:${import.meta.env.VITE_SERVER_PORT}`;

// apis
export const LOGIN_URL = `${BACKEND_API}/api/auth/login`;
export const ALL_USERS_URL = `${BACKEND_API}/api/users/`;
export const ONE_USER_URL = `${BACKEND_API}/api/users`;

export const ALL_PROJECTS_URL = `${BACKEND_API}/api/proj/`;
export const ONE_PROJECT_URL = `${BACKEND_API}/api/proj`;