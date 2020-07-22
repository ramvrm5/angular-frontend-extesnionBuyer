import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ProductService } from '../../services/product.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  extensionSold:String="0";
  sold:String="0";
  buyer:String="0";
  msgs: Message[] = [];
  viewAllType_extention: any = [];
  viewAllCategory_newExtension: any = [];
  constructor(
    private router: Router,
    private login: LoginComponent,
    private productService: ProductService,
    private spinner: NgxSpinnerService
  ) {
    this.viewAllType_extention = []
    this.viewAllCategory_newExtension = []
  }


  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    var token = localStorage.getItem("token");
    if (token) {
      this.router.navigate(['dashboard'])
    } else if (document.cookie) {
      this.login.forCookie();
    }else {
      this.router.navigate(['/'])
    }
    this.getProductTypeList();
  }
  
  getProductTypeList() {
    this.spinner.show();
    this.productService.getProductTypeListings().subscribe((response: any) => {
      if (response.status == 200) {
        this.viewAllType_extention = response.productTypeListing;
        this.getProductCategoryList();
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }

  getProductCategoryList() {
    this.spinner.show();
    this.productService.getProductCategoryListings().subscribe((response: any) => {
      if (response.status == 200) {
        this.viewAllCategory_newExtension = response.latestListings.listings;
        this.extensionSold = response.latestListings.stats.sold_listing;
        this.sold = response.latestListings.stats.sold_listing_cost;
        this.buyer = response.latestListings.stats.total_buyers;
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }
  
}
