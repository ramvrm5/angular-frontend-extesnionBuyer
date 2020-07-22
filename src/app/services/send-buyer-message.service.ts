import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SendBuyerMessageService {
    constructor(private httpClient: HttpClient) { }

    /* SUBMIT OFFER API  */
    sendBuyerMessage(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}product/sendbuyermessage`,data, { headers: headers });
    }

}