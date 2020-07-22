import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';

import { SharedService } from '../../services/shared.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  search;
  tokenBollean:boolean;
  homeRoute: boolean;
  loginRoute: boolean;
  listingnRoute: boolean;
  catlistRoute: boolean;
  token;
  product_name;
  product_type;
  store_url;
  visiblity: boolean=true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.tokenBollean = localStorage.getItem("token") ? true : false;
    this.product_name = "";
    this.product_type = "";
    this.visiblity;
    this.store_url = "";
  }

  ngOnInit() {
    this.sharedService.sharedMessage.subscribe((values: any) => {
      this.product_name = values.product_name,
        this.product_type = values.product_type,
        this.store_url = values.store_url,
        this.visiblity = values.visiblity
    })
    var router = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path :"/"
    if (router == 'home' || router == "/") {
      this.homeRoute = true;
      this.loginRoute = false;
      this.listingnRoute = false;
      this.catlistRoute = false;
    } else if (router == 'login' || router == 'signUp' || router == 'forgot-password' || router == 'reset-password') {
      this.loginRoute = true;
      this.homeRoute = false;
      this.listingnRoute = false;
      this.catlistRoute = false;
    } else if (router == 'extension-detail') {
      this.listingnRoute = true;
      this.homeRoute = false;
      this.loginRoute = false;
      this.catlistRoute = false;
    } else if (router == 'browse') {
      this.catlistRoute = true;
      this.homeRoute = false;
      this.loginRoute = false;
      this.listingnRoute = false;
    }
  }

  getValue() {
    var querryParam = { queryParams: { type: "all" ,q:this.search} }
    this.router.navigate(['/browse/extensions'], querryParam);
  }

}
