import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MyextensionDetailService {
    constructor(private httpClient: HttpClient) { }

    /* GET EXTENSION DETAIL API  */
	getExtensionDetail(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}product/view/`+id,{ headers: headers });
	}

    /* POST ACCEPTED OFFER DETAIL API  */
	acceptRequest(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}offer/accept/`+id,{ headers: headers });
	}

    /* POST EXTENSION DETAIL API  */
	rejectRequest(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}offer/reject/`+id,{ headers: headers });
	}

    /* POST APPROVE ACCESS DETAIL API  */
	approveAccessRequest(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}request/accept/`+id,{ headers: headers });
	}

    /* POST REJECT ACCESS API  */
	rejectAccessRequest(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}request/reject/`+id,{ headers: headers });
	}
}