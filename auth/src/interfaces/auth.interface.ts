import { User } from "./users.interface";

export interface LoginInterface {
  username: string;
  password: string;
}

export interface LoginReturn {
  token: string;
  user: User;
}
