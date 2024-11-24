import { Role } from "./role";


export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean; 
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: Role; 
  isActive: boolean;
}
