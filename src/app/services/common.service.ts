import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor(private httpClient: HttpClient) { }

    /* GET COUNTRY API  */
	getCountry() {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		return this.httpClient.get(`${environment.apiUrl}getcountries`,  { headers: headers });
	}	

    /* GET STATE API  */
	getState(id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		return this.httpClient.get(`${environment.apiUrl}getstate/`+id,  { headers: headers });
	}

    /* GET CITY API  */
	getCity(id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		return this.httpClient.get(`${environment.apiUrl}getcity/`+id,  { headers: headers });
    }
    
    /* GET PRODUCT TYPE AND CATEGORY API  */
    getProductCategory(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}getCategoriesAndProductType`,{ headers: headers });
	}
}