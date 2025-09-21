import { OrderStatus, Product } from "./models";

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
  products: Product[];
  status: OrderStatus;
  quantity: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdLabelType {
  id: number;
  label: string;
}