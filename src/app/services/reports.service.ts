import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Report } from '../models/response.models';
import { AuthService } from './auth.service';
import { FormGroup } from '@angular/forms';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
export class ReportsService {

    constructor(private http: HttpClient, private authService: AuthService) { }

    takeCurrentLastMonthReport(reportFilterForm: FormGroup): Observable<ApiResponse<Report>> {

        const payload = {
            companyId: +reportFilterForm.value.companyId,
            orgUnitId: +reportFilterForm.value.orgUnitId,
            productId: +reportFilterForm.value.productId
        };

        const token = this.authService.getAccessToken();

        return this.http.post<ApiResponse<Report>>(`${environment.apiUrl}/universal/take-current-last-month-report`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}