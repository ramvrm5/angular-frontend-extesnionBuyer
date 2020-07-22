import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  tokenBollean: boolean = false;
  constructor(
    private router: Router,
    private cookie: CookieService,
  ) {
    this.tokenBollean = localStorage.getItem("token") ? true : false;
  }

  ngOnInit() {
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    this.tokenBollean = false;
    this.router.navigate(['home']);
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

}
