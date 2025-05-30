import { User } from "@/app/types/user";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

const usersFile = path.join(process.cwd(), "src", "app", "data", "users.json");

// Default users (hashed passwords)
const defaultUsers: User[] = [
  {
    id: "1",
    name: "Admin",
    role: "engineer",
    password: bcrypt.hashSync("admin123", 10),
  },
  
];

// Load or initialize users
export async function loadUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    await fs.writeFile(usersFile, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
}

export async function findUser(username: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find((u) => u.name.toLowerCase() === username.toLowerCase());
}
