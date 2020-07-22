import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private httpClient: HttpClient) { }

    /* GET CHAT API  */
    getChat(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}get/chat`,data, { headers: headers });
    }

    /* GET MORE CHAT API  */
    getMoreChat(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}loadMore`,data, { headers: headers });
    }

    /* STORE CHAT API  */
    storeChat(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}store/chat`,data, { headers: headers });
    }

}