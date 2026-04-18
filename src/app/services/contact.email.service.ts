import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SendContactEmailRequest } from "../models/request.model";
import { ApiResponse } from "../models/response.models";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
  })
export class ContactEmailService {

    constructor(private http: HttpClient) { }

    sendContactEmail(contactData: SendContactEmailRequest): Observable<ApiResponse<null>> {

        return this.http.post<ApiResponse<null>>(environment.apiUrl + "/send-contact-email",  contactData);
    }

}