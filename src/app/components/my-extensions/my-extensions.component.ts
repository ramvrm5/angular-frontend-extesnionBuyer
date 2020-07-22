import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import sweetAlert from 'sweetalert2';
import * as $ from 'jquery';

import { ProductService } from '../../services/product.service';
import { ExpireTokenService } from '../../services/expire-token.service';

@Component({
  selector: 'app-my-extensions',
  templateUrl: './my-extensions.component.html',
  styleUrls: ['./my-extensions.component.css']
})
export class MyExtensionsComponent implements OnInit {

  activeList_rows: any[];
  activeList_headers: any[];
  progressList_row: any[];
  progressList_headers: any[];
  sold_row: any[];
  sold_headers: any[];
  activeList_headers_buyers: any[];
  activeList_buyers: any[];
  progressList_headers_buyers: any[];
  progressList_buyer_row: any[];
  sold_headers_buyers: any[];
  sold_buyer_row: any[];
  token;
  empty_images;

  constructor(
    private productService: ProductService,
    private expireTokenService: ExpireTokenService,
    private spinner: NgxSpinnerService
  ) {
    this.empty_images = "assets/images/emptyImage.png"
    this.activeList_headers = [
      { field: 'name', header: 'Name' },
      { field: 'images', header: 'Image' },
      { field: 'type', header: 'Type' },
      { field: 'received_offer', header: 'Received offers' },
      { field: 'avg_offers', header: 'Avg. offer' },
      { field: 'status', header: 'Status' },
    ];
    this.activeList_rows = [];

    this.progressList_headers = [
      { field: 'name', header: 'Name' },
      { field: 'images', header: 'Image' },
      { field: 'type', header: 'Type' },
      { field: 'received_offers', header: 'Received offer' },
      { field: 'sold_amount', header: 'Sold offer' },
      { field: 'buyer_name', header: 'Buyer' },
      { field: 'status', header: 'Status' },
    ];
    this.progressList_row = [];

    this.sold_headers = [
      { field: 'name', header: 'Name' },
      { field: 'images', header: 'Image' },
      { field: 'type', header: 'Type' },
      { field: 'recived_offer', header: 'Received offer' },
      { field: 'sold_offer', header: 'Sold offer' },
      { field: 'buyer_name', header: 'Buyer' },
      { field: 'status', header: 'Status' },
    ];
    this.sold_row = [];

    this.activeList_headers_buyers = [
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'type', header: 'Type' },
      { field: 'avg_offers', header: 'Average offer' },
      { field: 'my_offer', header: 'My offer' },
      { field: 'seller_name', header: 'Seller' },
      { field: 'bid_placed', header: 'Bid placed' },
    ];
    this.activeList_buyers = [];
    
  }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.spinner.show();
      this.getProductListing();
  }
  
  getProductListing() {
    this.spinner.show();
    this.token = localStorage.getItem("token");
    this.productService.getProductListings(this.token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        this.spinner.hide();
        this.activeList_rows = response.productListing.active;
        this.progressList_row = response.productListing.in_progess;
        this.sold_row = response.productListing.sold;
        this.spinner.hide();
        this.getBuyerListing();
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
  
  getBuyerListing() {
    this.spinner.show();
    this.token = localStorage.getItem("token");
    this.productService.getProductBuyerListings(this.token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        this.spinner.hide();
        this.activeList_buyers = response.buyerProduct.active;
        this.progressList_buyer_row = response.buyerProduct.in_progess;
        this.sold_buyer_row = response.buyerProduct.sold;
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  deleteList(id, index) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        sweetAlert.fire(
          'Deleted!',
          'Your Product has been deleted.',
          'success'
        )
        this.token = localStorage.getItem("token");
        this.productService.deleteProduct(this.token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            console.log(response);
          } else if (response["status"] == 200) {
            this.activeList_rows.splice(index, 1);
            sweetAlert.fire(
              'Deleted!',
              'Your Product has been deleted.',
              'success'
            )
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  check_inreview(type,i) {
    if (type == "0") {
      $("#delete_" + i).addClass("d-none");
    }
  }

  status_Check(type) {
    switch (type) {
      case "0":
        return "Under review";
      case "1":
        return "verified";
      case "2":
        return "Deal in progress";
      case "3":
        return "sold";
      case "4":
        return "Completed";
      case "5":
        return "rejected";
      /* default:
          return "label-default" */
    }
  }
}
