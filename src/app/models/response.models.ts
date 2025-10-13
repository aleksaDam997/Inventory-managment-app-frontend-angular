import { OrderProduct, OrderStatus, Product } from "./models";

export interface CreateApiResponse<T> {
  data: T | null;
  message: string;
  status: string;
}

export interface OrderResponse {
  orderId: number;
  userFirstName: string;
  userLastName: string;
  totalPrice: number;
  user: IdLabelType | undefined;
  products: OrderProduct[];
  status: OrderStatus;
  quantity: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdLabelType {
  id: number;
  label: string;
}

export interface Report {
  spendByMonth: SpendByMonth[];
  last12m: { label: string; value: number }[];
  last12mOrderSum: { label: string; value: number }[];
  last12mProductSum: { label: string; value: number }[];
  last12mProductQuantity: { label: string; value: number }[];
  top5OrgUnits: { label: string; value: number }[];
  top5ProductsLastMonth: { label: string; value: number }[];
  top5ProductsPreviousMonth: { label: string; value: number }[];
  top5ProductsNow: { label: string; value: number }[];
}

export interface SpendByMonth {
  label: string;
  value: number;
}
