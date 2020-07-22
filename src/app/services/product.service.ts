import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private httpClient: HttpClient) { }


    /* ADD PRODUCT API  */
	addProduct(data,token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.post(`${environment.apiUrl}product/create`,data,{ headers: headers });
    }
    
    /* DELETE PRODUCT API  */
	deleteProduct(token, id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}product/delete/`+id,{ headers: headers });
    }
    
    /* GET AND EDIT PRODUCT API  */
	editProductDetail(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}getProductRawDetails/`+id,{ headers: headers });
    }
    
    /* UPDATE PRODUCT API  */
	updateProductDetail(data,token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.post(`${environment.apiUrl}updateProductRawDetails/`+id,data,{ headers: headers });
	}
    
    /* PRODUCT LISTING API  */
	getProductListings(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}product/listing`,{ headers: headers });
	}      

    /* PRODUCT BUYER LISTING API  */
	getProductBuyerListings(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', 'Bearer ' + token);
		return this.httpClient.get(`${environment.apiUrl}product/getBuyerListings`,{ headers: headers });
	}

    /* PRODUCT TYPE LISTING API  */
	getProductTypeListings() {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		return this.httpClient.get(`${environment.apiUrl}product/getProductTypeListings`,{ headers: headers });
	}   

    /* PRODUCT CATEGORY LISTING API  */
	getProductCategoryListings() {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		return this.httpClient.get(`${environment.apiUrl}product/getLatestListings`,{ headers: headers });
	} 
}