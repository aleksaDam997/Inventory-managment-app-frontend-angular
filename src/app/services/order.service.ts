import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus, Product } from '../models/models';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, OrderResponse } from '../models/response.models';
import {  CreateOrderProductReq, CreateOrderRequest, OrderFilterRequest } from '../models/request.model';
import { OrderProduct } from '../models/models'
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
  })
export class OrderService {

constructor(private http: HttpClient, private authService: AuthService) { }

getOrdersByCriteria(orderFilterForm: FormGroup): Observable<ApiResponse<OrderResponse[]>> {

     const orderFilterReq: OrderFilterRequest = {
      startDate: orderFilterForm.get('startDate')?.value,
      endDate: orderFilterForm.get('endDate')?.value,
      status: orderFilterForm.get('status')?.value,
      companyId: +orderFilterForm.get('companyId')?.value,
      orgUnitId: +orderFilterForm.get('orgUnitId')?.value
    }

    const token = this.authService.getAccessToken();

    return this.http.post<ApiResponse<OrderResponse[]>>(environment.apiUrl + '/protected/get-orders-by-criteria', orderFilterReq, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}

getUserOrders(orderFilterForm: any): Observable<ApiResponse<OrderResponse[]>> {

    const token = this.authService.getAccessToken();    

    const params = new HttpParams()
    .set('date-from', orderFilterForm.startDate.toISOString())
    .set('date-to', orderFilterForm.endDate.toISOString())
    .set('status', orderFilterForm.status);

    return this.http.get<ApiResponse<OrderResponse[]>>(environment.apiUrl + '/base/get-my-orders', {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

makeOrder(orderForm: FormGroup): Observable<ApiResponse<Order>> {

    const orderProductsArray = orderForm.get('orderProducts');
    if (!(orderProductsArray instanceof FormArray)) throw new Error('orderProducts nije FormArray!');

    const products: CreateOrderProductReq[] = orderProductsArray.controls.map(control => {
    const group = control as FormGroup;
    return {
        productId: +group.get('productId')!.value,
        quantity: +group.get('quantity')!.value,
        currentPrice: +group.get('currentPrice')!.value,
    };
    });

    const order: CreateOrderRequest = {
        productId: null,
        orderId: null,
        status: null,
        products: products
    }    

    orderForm.reset();

    const orderProducts = orderForm.get('orderProducts') as FormArray;
    orderProducts.clear();

    const token = this.authService.getAccessToken();

    return this.http.post<ApiResponse<Order>>(environment.apiUrl + '/base/make-order', order, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}



updateOrder(orderForm: FormGroup): Observable<ApiResponse<Order>> {

    const orderProductsArray = orderForm.get('orderProducts');
    if (!(orderProductsArray instanceof FormArray)) throw new Error('orderProducts nije FormArray!');

    const products: CreateOrderProductReq[] = orderProductsArray.controls.map(control => {
    const group = control as FormGroup;
    return {
        orderProductId: Number(group.get('orderProductId')?.value) ?? 0,
        productId: +group.get('productId')!.value,
        quantity: +group.get('quantity')!.value,
        currentPrice: +group.get('currentPrice')!.value,
    };
    });

    const order: CreateOrderRequest = {
        productId: null,
        orderId: orderForm.get('orderId')?.value,
        status: orderForm.get('status')?.value,
        products: products
    }    

    orderForm.reset();

    const orderProducts = orderForm.get('orderProducts') as FormArray;
    orderProducts.clear();

    const token = this.authService.getAccessToken();

    return this.http.patch<ApiResponse<Order>>(environment.apiUrl + '/universal/update-order', order, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}

deleteOrder(orderId: number) {
    const token = this.authService.getAccessToken();

    return this.http.delete<ApiResponse<Order>>(environment.apiUrl + '/base/delete-order-by-id/' + orderId, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


forwardUserOrderStatus(orderId: number): Observable<ApiResponse<null>> {
    const token = this.authService.getAccessToken();
    console.log("Token:", token);

    return this.http.patch<ApiResponse<null>>(
        `${environment.apiUrl}/base/forward-order-status-user/${orderId}`,
        null, // <-- body, ako nemaš šta slati, stavi null
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

forwardEditorOrderStatus(orderId: number): Observable<ApiResponse<null>> {
    const token = this.authService.getAccessToken();
    console.log("Token:", token);

    return this.http.patch<ApiResponse<null>>(
        `${environment.apiUrl}/protected/forward-order-status-editor/${orderId}`,
        null, // <-- body, ako nemaš šta slati, stavi null
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}


getOrderStatuses(): OrderStatus[] {
    return [OrderStatus.PENDING, OrderStatus.CHANGED, OrderStatus.APPROVED, OrderStatus.COMPLETED];
}

}
