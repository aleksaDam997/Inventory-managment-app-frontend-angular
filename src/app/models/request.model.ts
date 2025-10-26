import { OrderStatus } from "./models";
import { UserRole } from "./user.model";

export interface LoginRequestModel {
  username: string;
  password: string;
}

export interface ConfirmAuthModel {
  userId: number;
  code: string;
  status: number;
  validUntil: Date;
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
  orgUnitId: number;
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

export interface CreateOrgUnit {
  orgUnitId: number | undefined | null;
  name: string | undefined;
  code: string | undefined;
  companyId: number | null | undefined;
}

export interface CreateProduct {
  productId: number;
  name: string;
  price: string;
  description: string | undefined;
  companyId: number | null;
}

export interface CreateOrderRequest {
  productId: number | undefined | null;
  orderId: number | undefined | null;
  products: CreateOrderProductReq[];
  status: OrderStatus | undefined | null;
}

export interface OrderFilterRequest {
  startDate: Date | null;
  endDate: Date | null;
  status: OrderStatus | null;
  companyId: number | null;
  orgUnitId: number | null;
}

export interface UpdateUserRequest {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
  role: UserRole | null;
  orgUnitId: number | null;
  address: string | null;
  phone: string | null;
  isActive: boolean | null;
}

export interface CreateOrderProductReq {

	productId: number | null;
	quantity: number  | null;
	currentPrice:number | null;

}