import mongoose from "mongoose";
import { LoginInterface } from "./auth.interface";

export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  WHOLESALE = "whole_sale",
  CLIENT = "client",
}

export interface User extends LoginInterface {
  _id?: string;
  id?: string;
  email: string;
  role?: UserRole;
  scopes?: string[];
  recovery_token?: string;
  profile_pictury?: string;
  name: string | undefined;
  last_name: string | undefined;
}
