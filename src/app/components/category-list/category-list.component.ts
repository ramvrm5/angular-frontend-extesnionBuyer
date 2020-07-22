import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';

import { BrowseExtensionService } from '../../services/browse-extension.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  firstload_searchType: boolean = false;
  filterName;
  number: any;
  empty_image: string;
  profile_image: string;
  Chrome: boolean = true;
  Mozila: boolean = false;
  Opera: boolean = false;
  Safari: boolean = false;
  Edge: boolean = false;
  listItem: any = [];
  listItemTemp: any = [];
  sortOptions: any = [];
  listItemPrivate: any = [];
  listItemPublic: any = [];
  sortKey: string;
  sortOrder: number;
  sortField: string;
  search_input: string;
  constructor(
    private browseExtensionService: BrowseExtensionService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.profile_image = "assets/images/emptyImage.png",
    this.empty_image = "assets/images/empty_carousel.png",
      this.sortOptions = [
        { label: 'Total User', value: 'total_users' },
        { label: 'Ask Price', value: 'price' },
      ];
    this.listItem = []
    this.listItemTemp = []
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterName = params['type'] ? params['type'] : 'all';
      this.search_input = params['q'];
      //this.filter_data(this.filterName, this.search_input ? this.search_input : "");
    });
  }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    $("#all").addClass("link");
    this.getAllProduct()
  }

  getAllProduct() {
    this.spinner.show();
    var token = localStorage.getItem("token");
    this.browseExtensionService.browseExtension().subscribe((response: any) => {
      if (response["status"] == 404) {
        console.log(response);
        this.spinner.hide();
      } else if (response["status"] == 200) {
        this.listItem = response.productListing;
        this.listItemTemp = response.productListing;
        this.listItemPrivate = this.listItemTemp.filter(function (item) {
          return item.visibilty == "1";
        });
        this.listItemPublic = this.listItemTemp.filter(function (item) {
          return item.visibilty == "0";
        });
        console.log(response);
        this.firstload_searchType = true;
        this.filter_data(this.filterName, this.search_input ? this.search_input : "");
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  filter_data(type, searchType) {
    /* this.spinner.show(); */
    $("a").removeClass("link");
    $("#" + type).addClass("link");
    var filter_name = type;
    var filter_name_searchType = searchType?searchType:this.search_input?this.search_input:"";
    var array: any = this.listItemTemp;
    this.listItem = this.listItemTemp.filter(function (item) {
      if (filter_name == "all") {
        return array;
      }
      return item.type == filter_name;
    });
    if (this.firstload_searchType && filter_name_searchType) {
      var number = /[^A-Za-z]/;
      var letters = /[^0-9]/;
      var product_name = letters.test(filter_name_searchType);
      var price = number.test(filter_name_searchType);
      var total_users = number.test(filter_name_searchType);
      if (product_name) {
        this.listItem = this.listItem.filter(function (item) {
          return item.product_name.toLowerCase().includes(filter_name_searchType.toLowerCase());
        });
        this.spinner.hide();
      } else if (total_users) {
        this.listItem = this.listItem.filter(function (item) {
          return item.total_users.includes(filter_name_searchType);
        });
        this.spinner.hide();
      }
    }
    this.spinner.hide();
    this.listItemPrivate = this.listItem.filter(function (item) {
      return item.visibilty == "1";
    });
    this.listItemPublic = this.listItem.filter(function (item) {
      return item.visibilty == "0";
    });
  }

  onSortChange(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onChange(type) {
    this.filterName = type;
    $("a").removeClass("link");
    const urlTree: any = this.router.createUrlTree([], {
      queryParams: { type: type },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree);
    if (type == 'Chrome') {
      this.Chrome = true;
      $("#Chrome").addClass("link");
    } else if (type == 'Mozila') {
      this.Mozila = true;
      $("#Mozila").addClass("link");
    } else if (type == 'Opera') {
      this.Opera = true;
      $("#Opera").addClass("link");
    } else if (type == 'Safari') {
      this.Safari = true;
      $("#Safari").addClass("link");
    } else if (type == 'Edge') {
      this.Edge = true;
      $("#Edge").addClass("link");
    }
    var querryParam = this.search_input == "" ? { queryParams: { type: this.filterName } } : { queryParams: { type: this.filterName, q: this.search_input } }
    this.router.navigate(['/browse/extensions'], querryParam);
    this.filter_data(type, '');
  }

  onchangeInput(event) {
    this.listItem = this.listItemTemp.filter(function (item) {
      return item.product_name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    this.listItemPrivate = this.listItem.filter(function (item) {
      return item.visibilty == "1";
    });
    this.listItemPublic = this.listItem.filter(function (item) {
      return item.visibilty == "0";
    });
    this.firstload_searchType = false;
    if (this.search_input == "") {
      var querryParam1 = { queryParams: { type: this.filterName } }
      this.router.navigate(['/browse/extensions'], querryParam1);
    } else {
      var querryParam = { queryParams: { type: this.filterName, q: this.search_input } }
      this.router.navigate(['/browse/extensions'], querryParam);
    }
    this.listItem.length;
  }
}
