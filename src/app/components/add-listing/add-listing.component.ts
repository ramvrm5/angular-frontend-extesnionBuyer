import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import * as $ from 'jquery';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';

import { ProductService } from '../../services/product.service';
import { CommonService } from '../../services/common.service';
import { ExpireTokenService } from '../../services/expire-token.service';


@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {
  value: Date;
  product_data: any = {};
  steps: MenuItem[];
  activeIndex: number = 0;
  extension_category: SelectItem[];
  extension_type: any;
  
  /********* FORM STEPS **********/
  basic: boolean = false;
  analytics: boolean = false;
  upload: boolean = false;
  review_submit: boolean = false;
  /*******************/
  
  src_stats_default_image_icon:any= "assets/images/upload_button.png";
  src_banner_default_image_icon:any= "assets/images/upload_banner.png";
  
  stats_image_array:any=[];
  stats_image_id_array:any=[]; 
  stats_image_boolean: boolean = false;
  stats_image_validation: boolean = false;  

  country_list:any=[];
  banner_image_array: any = [];
  banner_image_id_array:any=[];
  banner_image_boolean: boolean = false;  
  banner_image_validation: boolean = false;
  
  product_image_ids:any=[];  
  
  
  total_user_validation: boolean = false;
  
  displayStatsImagesModal: boolean;
  displayBannerImagesModal: boolean;
  
  data: FormGroup;
  data_1: any;
  data_2: any;
  data_3: any;

  
  submitted_1 = false;
  firstLoad_1 = true;
  submitted = false;
  firstLoad = true;
  token;
  msgs: Message[] = [];
  userbase: any = [{
    country_id: '',
    user: '',
  }];
  url_pattern: any = /^(http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private expireTokenService: ExpireTokenService,
    private spinner: NgxSpinnerService
  ) {
    this.data = this.formBuilder.group({
      extension_type: ['', Validators.required],
      extension_name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      store_url: ['', [Validators.required,Validators.pattern(this.url_pattern)]],
      extension_category: ['', Validators.required],
      website: ['', [Validators.required,Validators.pattern(this.url_pattern)]],
      publish_date: ['', Validators.required],
    });
    this.data_1 = {
      total_user: '',
      statistics_images: {},
      userbase: '',
    };
    this.data_2 = {
      banner_images: {},
    };
    this.data_3 = this.formBuilder.group({
      price: ['', [Validators.required, Validators.pattern("^[0-9.,]+$")]],
      currency:'usd',
      negotiable: false,
      public_private: false
    });

  }
  get f() { return this.data.controls; }
  get g() { return this.data_3.controls; }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.basic = true;
    this.steps = [{
      label: 'BASIC DETAILS',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'ANALYTICS',
      command: (event: any) => {
        this.activeIndex = 1;
      }
    },
    {
      label: 'UPLOAD',
      command: (event: any) => {
        this.activeIndex = 2;
      }
    },
    {
      label: 'SUBMIT',
      command: (event: any) => {
        this.activeIndex = 3;
      }
    }
    ];
    this.getProductCategory()
    this.getCountry();
  }

  add() {
    this.userbase.push({
      country: '',
      user: '',
    });
  }
  
  remove(i: number, array) {
    if (array.length > 1) {
      this.userbase.splice(i, 1);
    }
  }
  dateSelector(event) {
    var publish_date = moment(event).format("DD/MM/YYYY");
    this.data.patchValue({ "publish_date": publish_date });
  }

  getCountry() {
    this.spinner.show();
    this.commonService.getCountry().subscribe((response: any) => {
      if (response.status == 200) {
        var array: any = response["country"];
        var temp = [];
        for (let i = 0; i < array.length; i++) {
          temp.push({ country_id: array[i].id, name: array[i].name });
        }
        this.country_list = temp;
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }

  getProductCategory() {
    this.spinner.show();
    this.token = localStorage.getItem("token");
    this.commonService.getProductCategory(this.token).subscribe((response: any) => {
      if (response.status == 200) {
        var temp_category = [];
        var temp_Product = [];
        var categories = response.categories;
        var product = response.product_type;
        for (let i = 0; i < categories.length; i++) {
          temp_category.push({label: categories[i].category_name, value: categories[i].id })//, extension_type_name: categories[i].category_name
        }
        this.extension_category = temp_category;
        for (let i = 0; i < product.length; i++) {
          temp_Product.push({ id: product[i].id, category_name: product[i].display_type_name })
        }
        this.extension_type = temp_Product;
        this.spinner.hide();
      }
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
  classForValidation_1(type) {
    if (this.firstLoad_1) {
      return
    }
    else if (this.submitted_1 && this.g.price.errors && (type == 'price')) {
      return 'is-invalid';
    } else if (this.submitted_1 && this.g.negotiable.errors && (type == 'negotiable')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }
  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.extension_type.errors && (type == 'extension_type')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.extension_name.errors && (type == 'extension_name')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.description.errors && (type == 'description')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.store_url.errors && (type == 'store_url')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.extension_category.errors && (type == 'extension_category')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.website.errors && (type == 'website')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.publish_date.errors && (type == 'publish_date')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  submit_step1() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    this.data.value;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    this.spinner.hide();
    this.activeIndex = 1;
    this.onChangeWizard("", 1);
  }

  submit_step2() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.data_1;
    this.stats_image_validation = false;
    this.total_user_validation = false;
    if (this.stats_image_array.length <= 0) {
      this.stats_image_validation = true;
      if (!this.data_1.total_user) {
        this.total_user_validation = true;
        return
      }
      return
    }
    if (!this.data_1.total_user) {
      this.stats_image_validation = true;
      return
    }
    this.activeIndex = 2;
    this.onChangeWizard("", 2);
  }

  submit_step3() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.data_2;
    this.banner_image_validation = false;
    if (this.banner_image_array.length <= 0) {
      this.banner_image_validation = true;
      return
    }
    this.activeIndex = 3;
    this.onChangeWizard("", 3);
  }

  submit_step4() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.spinner.show();
    this.firstLoad_1 = false;
    this.submitted_1 = true;
    this.g.negotiable.errors;
    if (this.data_3.invalid) {
      this.spinner.hide();
      return;
    }
    this.token = localStorage.getItem("token");
    this.product_data["cat_id"] = this.data.value.extension_category;
    this.product_data["product_image_ids"] = this.product_image_ids;
    this.product_data["product_type_id"] = this.data.value.extension_type;
    this.product_data["product_name"] = this.data.value.extension_name;
    this.product_data["price"] = this.data_3.value.price;
    this.product_data["description"] = this.data.value.description;
    this.product_data["total_users"] = this.data_1.total_user;
    this.product_data["negotiate"] = this.data_3.value.negotiable == true?"1":"0";
    this.product_data["currency"] = this.data_3.value.currency;
    this.product_data["publish_date"] = this.data.value.publish_date;
    this.product_data["userbase"] = this.userbase;
    this.product_data["website"] = this.data.value.website;
    this.product_data["store_url"] = this.data.value.store_url;
    this.product_data["visibilty"] = this.data_3.value.public_private == true?"1":"0";
    this.productService.addProduct(this.product_data, this.token).subscribe((response: any) => {
      if (response.status == 200) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.msgs = [];
          this.router.navigate(['my-extension']);
        }, 3000)
      } else if (response.status == 400){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.msgs = [];
        }, 3000)
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: "Please check all required fields are filled or your token is expired" });
      this.spinner.hide();
      setTimeout(() => {
        this.msgs = [];
      }, 5000)
    })
  }

  onChangeExtensionType(event) {
    console.log(event);
  }

  onChangeExtensionName(event) {
    console.log(event);
    /* this.data.setValue({"extension_category":""}) */
/*     for (let i = 0; i < event.value.length; i++) {
      this.data.value.extension_category.push(event.value[i].id)
    } */
  }

  onChangeWizard(index, value) {
    var step = index && index >= 0 ? index : value;
    if (step == 0) {
      this.basic = true;
      this.analytics = false;
      this.upload = false;
      this.review_submit = false;
    }
    else if (step == 1) {
      this.basic = false;
      this.analytics = true;
      this.upload = false;
      this.review_submit = false;
    }
    else if (step == 2) {
      this.basic = false;
      this.analytics = false;
      this.upload = true;
      this.review_submit = false;
    }
    else if (step == 3) {
      this.basic = false;
      this.analytics = false;
      this.upload = false;
      this.review_submit = true;
    }
  }

  showStatisticImagesDialog() {
    this.displayStatsImagesModal = true;
  }

  showBannerImagesDialog() {
    this.displayBannerImagesModal = true;
  }

  onUploadStatisticImages(event) {
    console.log(event);
    if (event.originalEvent.body.status == 200) {
      this.stats_image_boolean = true;
      this.stats_image_validation = false;
      this.stats_image_id_array = event.originalEvent.body.image_id;
      this.product_image_ids = this.banner_image_id_array.concat(this.stats_image_id_array);
      for (let i = 0; i < event.originalEvent.body.image_path.length;i++){
        this.stats_image_array.push(event.originalEvent.body.image_path[i].replace("full_image","100x100"));
      }
      this.displayStatsImagesModal = false;
    }
  }

  onUploadBannerImages(event) {
    if (event.originalEvent.body.status == 200) {
      this.banner_image_boolean = true;
      this.banner_image_validation = false;
      this.banner_image_id_array = event.originalEvent.body.image_id;
      this.product_image_ids = this.stats_image_id_array.concat(this.banner_image_id_array);
      for (let i = 0; i < event.originalEvent.body.image_path.length;i++){
        this.banner_image_array.push(event.originalEvent.body.image_path[i]);
      }
      this.displayBannerImagesModal = false;
    }
  }

  step_1() {
    this.activeIndex = 0;
    this.basic = true;
    this.analytics = false;
    this.upload = false;
    this.review_submit = false;
  }

  step_2() {
    this.activeIndex = 1;
    this.basic = false;
    this.analytics = true;
    this.upload = false;
    this.review_submit = false;
  }

  step_3() {
    this.activeIndex = 2;
    this.basic = false;
    this.analytics = false;
    this.upload = true;
    this.review_submit = false;
  }
}
