import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RefreshTokenService } from '../../services/refresh-token.service';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css']
})
export class NavigationbarComponent implements OnInit {
  search:string
  token:string
  search_bar_hide: boolean = true;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService,
    private apiService: RefreshTokenService,
  ) { 
    this.token = localStorage.getItem("token");
  }

  ngOnInit() {
    var router = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : "/";
    if (router == "browse") {
      this.search_bar_hide = false;
    }
    /* this.verifyUserToken(); */
    setInterval(() => {
      this.verifyUserToken();
    }, 10 * 60000);
  }

  verifyUserToken() {
    if (this.token) {
      //this.spinner.show();
      var tokenTemp = localStorage.getItem("token");
      if (tokenTemp == null) {
        this.token = "";
        return
      }
      console.log("before " + tokenTemp);
      this.apiService.refreshToken(tokenTemp).subscribe((response: any) => {
        if (response["status"] == 404) {
          localStorage.removeItem("token");
          localStorage.clear();
          this.router.navigate(['login']);
          //this.spinner.hide();
          console.log(response);
        } else if (response.access_token) {
          var token = response["access_token"];
          console.log("after " + token);
          localStorage.removeItem("token");
          localStorage.setItem("token",token);
          //this.spinner.hide();
          console.log(response);
        }
      }, (err) => {
        //this.spinner.hide();
          localStorage.removeItem("token");
          localStorage.clear();
          this.router.navigate(['login']);
          console.log(err);
      })
    }
  }

  logout() {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 7 * 24 * 60 * 60 * 1000;
    now.setTime(expireTime);
    document.cookie = "email=" + "" + ';expires=' + now.toUTCString() + ';path=/';
    document.cookie = "password=" + "" + ';expires=' + now.toUTCString() + ';path=/';
    //this.cookie.deleteAll();
    window.localStorage.clear();
    this.router.navigate(['home']);
  }

  getValue() {
    var querryParam = { queryParams: { type: "all" ,q:this.search} }
    this.router.navigate(['/browse/extensions'], querryParam);
  }
}
