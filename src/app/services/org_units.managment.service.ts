import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrgUnit } from '../models/models';
import { environment } from '../../environments/environment';
import { CreateApiResponse } from '../models/response.models';
import { AuthService } from './auth.service';
import { CreateOrgUnit } from '../models/request.model';
// import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
export class OrgUnitsManagmentService {

constructor(private http: HttpClient, private authService: AuthService) { }

getAllOrgUnits(): Observable<OrgUnit[]> {

    const token = this.authService.getAccessToken();

    return this.http.get<OrgUnit[]>(environment.apiUrl + '/protected/get-all-org-units', {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
    return this.http.get<OrgUnit[]>(environment.apiUrl + '/protected/get-all-org-units');
}



getOrgUnitsByCompanyId(companyId: number): Observable<OrgUnit[]> {

    const token = this.authService.getAccessToken();

    return this.http.get<OrgUnit[]>(`${environment.apiUrl}/protected/get-org-units-by-companyId/${companyId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


createNewOrgUnit(orgUnit: CreateOrgUnit): Observable<CreateApiResponse<OrgUnit>> {

    const token = this.authService.getAccessToken();

    return this.http.post<CreateApiResponse<OrgUnit>>(environment.apiUrl + '/protected/create-org-unit', orgUnit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
}

updateOrgUnit(orgUnit: CreateOrgUnit): Observable<CreateApiResponse<OrgUnit>> {
    const token = this.authService.getAccessToken();
    return this.http.put<CreateApiResponse<OrgUnit>>(environment.apiUrl + '/protected/update-org-unit', orgUnit, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
}

deleteOrgUnit(orgUnitId: number): Observable<CreateApiResponse<OrgUnit>> {
    const token = this.authService.getAccessToken();
    return this.http.delete<CreateApiResponse<OrgUnit>>(environment.apiUrl + '/protected/delete-org-unit-by-id/' + orgUnitId, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

}

}
