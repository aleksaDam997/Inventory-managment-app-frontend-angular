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
  export class CodeTablesService {

    userData: LoginResponse | null = null;

    private apiUrl = 'http://localhost:8080/code-tables';
  
    constructor(private http: HttpClient) { }
  
  
  }
