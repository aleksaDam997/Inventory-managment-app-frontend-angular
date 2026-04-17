import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { SendContactEmailRequest } from "../models/request.model";
import { CreateApiResponse } from "../models/response.models";
import { environment } from "../../environments/environment.production";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
  })
export class ContactEmailService {

    constructor(private http: HttpClient) { }

    sendContactEmail(contactData: SendContactEmailRequest): Observable<CreateApiResponse<null>> {

        return this.http.post<CreateApiResponse<null>>(environment.apiUrl + "/send-contact-email",  contactData);
    }

}