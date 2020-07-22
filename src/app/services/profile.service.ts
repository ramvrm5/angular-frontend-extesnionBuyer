import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private httpClient: HttpClient) { }

    /* UPDATE PROFILE API  */
    profile_update(data, token) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}user/updateprofile`, data, { headers: headers });
    }

    /* GET PROFILE API  */
    get_profile(token) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.get(`${environment.apiUrl}me`, { headers: headers });
    }

    /* GET USER PROFILE API  */
    userProfile(token,username) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + token);
        return this.httpClient.post(`${environment.apiUrl}getPublicProfile`,username, { headers: headers });
    }

}