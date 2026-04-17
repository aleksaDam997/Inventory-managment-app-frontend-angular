export interface Users {
  userId: number;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  role: UserRole;
  createdAt: string; 
  updatedAt: string;
  companyId: number;
  orgUnitId: number;
  isActive: boolean;
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';  

export interface LoginResponse {
  accessToken: string;
  role: UserRole;
  companyId: number;
  status: number
  originPass: boolean;
  expiresIn: string;
}
