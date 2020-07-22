import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';

import { ExpireTokenService } from '../../services/expire-token.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  token;
  dashBoard: boolean = true;
  viewUser: boolean = false;
  userProfile: boolean = false;
  changePassword: boolean = false;
  addProduct: boolean = false;
  editProduct: boolean = false;
  myExtension: boolean = false;
  extensionDetail: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private expireTokenService: ExpireTokenService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.getProductCategory();
  }

  getProductCategory() {
    this.spinner.show();
    this.token = localStorage.getItem("token");
    this.commonService.getProductCategory(this.token).subscribe((response: any) => {
      this.spinner.hide();
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
