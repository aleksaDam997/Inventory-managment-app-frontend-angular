export interface Company {
  companyId: number;
  name: string;
  pib: string;
  upin: string;
  address: string;
  city: string;
  postalCode: number;
  country: string;
  email: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;

  orgUnits: OrgUnit[];
}

export interface OrgUnit {
  orgUnitId: number;
  name: string;
  code: string;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  orderId: number;
  userId: number | undefined;
  productId: number | undefined;
  status: OrderStatus;
  products: OrderProduct[];
  quantity: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

// export type OrderStatus = 'PENDING' | 'CHANGED' | 'APPROVED' | 'COMPLETED';

export enum OrderStatus {
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = 'PENDING',
  CHANGED = 'CHANGED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
}


export interface OrderProduct {
  orderproductId: number | null;
  orderId: number | null;
	name: string | null;
	productId: number | null;
	quantity: number  | null;
	currentPrice:number | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export interface Notification {
  notificationId: number;
  userToId: number;
  userFromId: number;
  orderId: number;
  message: string;
  companyId: number | null;
  notificationType: string;
  createdAt: Date;
  updatedAt: Date;
}

