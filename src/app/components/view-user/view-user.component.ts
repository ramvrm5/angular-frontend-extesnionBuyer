import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';

import { ProfileService } from '../../services/profile.service';
import { ExpireTokenService } from '../../services/expire-token.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  profileImage: String;
  flag_code: String = "in";
  State;
  country;
  joined_date;
  fullName: String = "------ --------";
  total_listing: String = "0";
  sold_Listing: String = "0";
  username: String = "---------";
  username_id;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService,
    private profileService: ProfileService,
    private expireTokenService: ExpireTokenService,
    private spinner: NgxSpinnerService
  ) {
    /*     this.activatedRoute.queryParams.subscribe(params => {
          this.username = params['username'];
        }); */
    this.profileImage = "assets/images/emptyImage.png";
  }

  ngOnInit(): void {
    this.username_id = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[1].path : "/"
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.getUserProfile()
  }

  getUserProfile() {
    this.spinner.show();
    var token = localStorage.getItem("token");
    var data = { "username": this.username_id }
    this.profileService.userProfile(token, data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        this.flag_code = "in";
        this.fullName = response.user.name + " " + response.user.last_name;
        this.username = response.user.username;
        this.profileImage = response.user.image_path;
        this.country = response.user.country;
        this.State = response.user.state;
        this.joined_date = response.user.joinDate;
        this.total_listing = response.user.total_listing;
        this.sold_Listing = response.user.sold_Listing;
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      if (err.status == 401 && err.statusText == "Unauthorized") {
        this.expireTokenService.expireToken();
        localStorage.clear();
      }
      console.log(err);
    })
  }

}
