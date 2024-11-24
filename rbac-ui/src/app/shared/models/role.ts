export interface Role {
  id: number;
  name: string;
  permissions: number[];
  isProtected: boolean;
}

export interface RoleCreate {
  name: string;
  permissions: number[];
  isProtected: boolean;
}
