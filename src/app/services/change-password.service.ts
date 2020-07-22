import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordService {
    constructor(private httpClient: HttpClient) { }

    /* CHANGE PASSWORD API  */
	changePassword(data,token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.post(`${environment.apiUrl}user/changepassword`, data, { headers: headers });
	}		
}