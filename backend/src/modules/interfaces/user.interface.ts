type roles = "admin" | "user";

interface User {
    id: string;
    name: string;
    email: string;
    role: roles;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
  
export {
    User,
    roles
};