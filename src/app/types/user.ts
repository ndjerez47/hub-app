export interface User {
  id: string;
  name: string;
  role: "viewer" | "operator" | "mechanic" | "engineer" | "admin";
  email: string;
}