import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/models';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/response.models';
import { AuthService } from './auth.service';
import { CreateProduct } from '../models/request.model';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
export class ProductService {

constructor(private http: HttpClient, private authService: AuthService) { }

getAllProducts(): Observable<Product[]> {

    const token = this.authService.getAccessToken();

    return this.http.get<Product[]>(environment.apiUrl + '/universal/get-all-products', {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
}



getProductsByCompanyId(companyId: number): Observable<Product[]> {

    const token = this.authService.getAccessToken();

    return this.http.get<Product[]>(`${environment.apiUrl}/protected/get-product-by-companyId/${companyId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


createNewProduct(product: CreateProduct): Observable<ApiResponse<Product>> {

    const token = this.authService.getAccessToken();

    return this.http.post<ApiResponse<Product>>(environment.apiUrl + '/protected/create-product', product, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
}

updateProduct(product: CreateProduct): Observable<ApiResponse<Product>> {
    const token = this.authService.getAccessToken();
    return this.http.put<ApiResponse<Product>>(environment.apiUrl + '/protected/update-product', product, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
}

deleteProduct(productId: number): Observable<ApiResponse<Product>> {
    const token = this.authService.getAccessToken();
    return this.http.delete<ApiResponse<Product>>(environment.apiUrl + '/protected/delete-product-by-id/' + productId, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

}

}
