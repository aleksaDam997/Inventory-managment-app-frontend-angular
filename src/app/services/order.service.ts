import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Product } from '../models/models';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CreateApiResponse, OrderResponse } from '../models/response.models';
import { CreateOrderRequest, OrderFilterRequest } from '../models/request.model';

@Injectable({
    providedIn: 'root'
  })
export class OrderService {

constructor(private http: HttpClient, private authService: AuthService) { }

getOrdersByCriteria(orderFilterReq: OrderFilterRequest): Observable<OrderResponse[]> {

    const token = this.authService.getAccessToken();

    return this.http.post<OrderResponse[]>(environment.apiUrl + '/base/get-orders-by-criteria', orderFilterReq, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}

makeOrder(order: CreateOrderRequest): Observable<CreateApiResponse<Order>> {

    const token = this.authService.getAccessToken();

    return this.http.post<CreateApiResponse<Order>>(environment.apiUrl + '/base/make-order', order, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}



updateOrder(order: CreateOrderRequest): Observable<CreateApiResponse<Order>> {

    const token = this.authService.getAccessToken();

    return this.http.put<CreateApiResponse<Order>>(environment.apiUrl + '/base/update-order', order, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}

}
