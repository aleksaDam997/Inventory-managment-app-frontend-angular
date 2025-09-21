import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyRequest, LoginRequestModel } from '../models/request.model';
import { Company } from '../models/models';
import { environment } from '../../environments/environment';
import { CreateApiResponse } from '../models/response.models';
import { AuthService } from './auth.service';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
  export class CompanyManagmentService {


  
    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllCompanies(): Observable<Company[]> {
          
        const token = this.authService.getAccessToken();
    
        return this.http.get<Company[]>(environment.apiUrl + '/universal/get-all-companies', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
    }

    createNewCompany(company: CompanyRequest): Observable<CreateApiResponse<Company>> {
      const token = this.authService.getAccessToken();

      return this.http.post<CreateApiResponse<Company>>(environment.apiUrl + '/protected/create-new-company', company, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
    }

    updateCompany(company: CompanyRequest): Observable<CreateApiResponse<Company>> {
      const token = this.authService.getAccessToken();
      return this.http.put<CreateApiResponse<Company>>(environment.apiUrl + '/protected/update-existing-company', company, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
    }

    deleteCompany(companyId: number): Observable<CreateApiResponse<Company>> {
      const token = this.authService.getAccessToken();
      return this.http.delete<CreateApiResponse<Company>>(environment.apiUrl + '/protected/delete-company-by-id/' + companyId, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

    }

  }
