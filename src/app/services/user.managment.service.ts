import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, Users } from '../models/user.model';
import { CreateUserRequest, UpdateuserProfileRequest, UpdateUserRequest, UserFilterRequest } from '../models/request.model';
import { AuthService } from './auth.service';
import { CreateApiResponse } from '../models/response.models';
import { environment } from '../../environments/environment.development';
import { FormGroup } from '@angular/forms';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
  export class UserManagmentService {
  
    constructor(private http: HttpClient, private authService: AuthService) { }

    getUsersByFilterCriteria(userFilterForm: FormGroup): Observable<Users[]> {

    const userFilterRequest: UserFilterRequest = {
      inputText: userFilterForm.value.inputText,
      role: userFilterForm.value.role,
      companyId: +userFilterForm.value.companyId,
      orgUnitId: +userFilterForm.value.orgUnitId,
      isActive: userFilterForm.value.isActive
    }

      const token = this.authService.getAccessToken();

      return this.http.post<Users[]>(environment.apiUrl + '/protected/userFilterCriteria', userFilterRequest, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    createNewUser(user: CreateUserRequest): Observable<Users> {

      const token = this.authService.getAccessToken();
      return this.http.post<Users>(environment.apiUrl + '/protected/create-new-user', user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    updateAnotherUser(user: UpdateUserRequest): Observable<CreateApiResponse<Users>> {
      const token = this.authService.getAccessToken();

      return this.http.patch<CreateApiResponse<Users>>(environment.apiUrl + '/protected/update-another-user', user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } 

    deleteUser(userId: number): Observable<void> {
      const token = this.authService.getAccessToken();
      return this.http.delete<void>(environment.apiUrl + `/protected/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }



    updateUserProfile(uupr: UpdateuserProfileRequest): Observable<LoginResponse> {
      const token = this.authService.getAccessToken();
    
      return this.http.patch<LoginResponse>(environment.apiUrl + "/universal/update-user-profile",  uupr, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    getBriefUserProfile(): Observable<Users> {
      const token = this.authService.getAccessToken();
    
      return this.http.get<Users>(environment.apiUrl + "/universal/get-brief-user-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
