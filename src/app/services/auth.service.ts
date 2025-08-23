import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, Users } from '../models/user.model';
import { LoginRequestModel } from '../models/request.model';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    userData: LoginResponse | null = null;

    private apiUrl = 'http://localhost:8080/login';
  
    constructor(private http: HttpClient) { }
  
    login(LoginRequestModel: LoginRequestModel): Observable<LoginResponse> {

      return this.http.post<LoginResponse>(this.apiUrl, LoginRequestModel);
    }
    

    saveAccessToken(token: string): void {
      localStorage.setItem('access_token', token);
    }

    removeAccessToken(): void {
      localStorage.removeItem('access_token');
    }

    getAccessToken(): string | null {
      return localStorage.getItem('access_token');
    }

    saveUsername(username: string): void {
      localStorage.setItem('username', username);
    }

    getUsername(): string | null {
      return localStorage.getItem('username');
    }

    getUserRole(): string | null {
      return localStorage.getItem('user_role');
    }

    saveUserRole(role: string): void {
      localStorage.setItem('user_role', role);
    }

    removeUserRole(): void {
      localStorage.removeItem('user_role');
    }

    removeUsername(): void {
      localStorage.removeItem('username');
    }

    saveCompanyId(companyId: number): void {
      localStorage.setItem('company_id', companyId.toString());
    }

    removeCompanyId(): void {
      localStorage.removeItem('company_id');
    }

    getCompanyId(): number | null {
      const companyId = localStorage.getItem('company_id');
      return companyId ? parseInt(companyId, 10) : null;
    }

    setUserData(userData: LoginResponse): void {
      this.userData = userData;
    }

    getUserData(): LoginResponse | null {
      return this.userData;
    }
  }
