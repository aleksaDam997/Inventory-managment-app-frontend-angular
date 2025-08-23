import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../models/user.model';
import { CreateUserRequest, UserFilterRequest } from '../models/request.model';
import { AuthService } from './auth.service';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
  export class UserManagmentService {


    private apiUrl = 'http://localhost:8080/protected/userFilterCriteria';
  
    constructor(private http: HttpClient, private authService: AuthService) { }

    getUsersByFilterCriteria(UserFilterRequest: UserFilterRequest): Observable<Users[]> {

      const token = this.authService.getAccessToken();

      return this.http.post<Users[]>(this.apiUrl, UserFilterRequest, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    createNewUser(user: CreateUserRequest): Observable<Users> {
      return this.http.post<Users>('http://localhost:8080/create-new-user', user);
    }

  }
