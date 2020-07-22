import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BrowseExtensionService {
    constructor(
        private httpClient: HttpClient,
    ) { }

    /* BROWSE ALL EXTENSION API  */
    browseExtension() {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        return this.httpClient.get(`${environment.apiUrl}product/getall`, { headers: headers });
    }
}