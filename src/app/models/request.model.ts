import { UserRole } from "./user.model";

export interface LoginRequestModel {
  username: string;
  password: string;
}

export interface UserFilterRequest {
  inputText: string;
  role: UserRole | null;
  companyId: number | null;
  orgUnitId: number | null;
  isActive: boolean | null;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  address: string;
  phone: string;
  companyId: number;
  isActive: boolean;
}

export interface CompanyRequest {
  companyId?: number;
  name?: string;
  pib?: string;
  upin?: string;
  address?: string;
  city?: string;
  postalCode?: number;
  country?: string;
  email?: string;
  website?: string;
}
