import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import * as $ from 'jquery';

import { ProfileService } from '../../services/profile.service';
import { CommonService } from '../../services/common.service';
import { ExpireTokenService } from '../../services/expire-token.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  location: any = {
    country: '',
    state: '',
    city: ''
  };
  dis_city: boolean = false;
  dis_state: boolean = false;
  model_city;
  model_state;
  model_country_temp;
  model_state_temp;
  model_city_temp;
  dropdownOptions: any;
  config;
  dropdownOptions1: any;
  config1;
  dropdownOptions2: any;
  config2;
  countryId: any;
  stateId: any;
  cityId: any;
  token;
  src_Image;
  data: FormGroup;
  getCountryValue: boolean = false;
  getStateValue: boolean = false;
  getCityValue: boolean = false;
  submitted = false;
  firstLoad: boolean = true
  displayModal: boolean;
  uploadedFiles: any[] = [];
  msgs: Message[] = [];
  lmsgs: Message[] = [];
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private expireTokenService: ExpireTokenService,
    private spinner: NgxSpinnerService
  ) {
    this.src_Image = "assets/images/emptyImage.png";
    this.config = {
      displayKey: "description", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Country', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      //limitTo: options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search',// label thats displayed in search input,
      searchOnKey: 'description',// key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
      clearOnSelection: true,
    }
    this.config1 = {
      displayKey: "description",
      search: true,
      height: 'auto',
      placeholder: 'Select State',
      customComparator: () => { },
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search',
      searchOnKey: 'description',
    }
    this.config2 = {
      displayKey: "description",
      search: true,
      height: 'auto',
      placeholder: 'Select City',
      customComparator: () => { },
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search',
      searchOnKey: 'description',
    }
    this.data = this.formBuilder.group({
      uploadimage: "",
      update_image: "0",
      state: ['', Validators.required],
      country: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      city: ['', Validators.required],
      zip_code: ['', Validators.required],
      address_line: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.spinner.show();
    setTimeout(() => {
      this.getProfileData();
      this.spinner.hide();
    },1200)
  }

  getProfileData() {
    this.token = localStorage.getItem("token");
    this.profileService.get_profile(this.token).subscribe((response: any) => {
      if (response) {
        this.data.patchValue({
          last_name: response.last_name,
          first_name: response.name,
          email: response.email,
          phone_no: response.phone_no,
          zip_code: response.zip_code,
          address_line: response.address_line,
        });
        this.countryId = response.country_id;
        this.stateId = response.state_id;
        this.cityId = response.city_id;
        if (response.image_path) {
          var image = response.image_path.replace("\\", "");
          this.src_Image = image;
        }

        if (response.country_id) {
          this.getCountryValue = true;
          if (response.state_id) {
            this.getStateValue = true;
            if (response.city_id) {
              this.getCityValue = true;
            }
          }
        }
        this.getCountry();
      }
      //this.spinner.hide();
    }, (err) => {
      console.log(err);
      /*       this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.message }); */
      this.spinner.hide();
      if (err.status == 401 && err.statusText == "Unauthorized") {
        this.expireTokenService.expireToken();
        localStorage.clear();
      }
    })
  }

  showModalDialog() {
    this.displayModal = true;
  }

  onUpload(event) {
    console.log(event);
    if (event.originalEvent.body.status == 200) {
      this.data.patchValue({
        update_image: "1",
        uploadimage: event.originalEvent.body.image_name
      });
      //var res = event.originalEvent.body.path.replace("\\", "");
      this.src_Image = event.originalEvent.body.path;
      this.displayModal = false;
    } else if (event.originalEvent.body.message == "Image not uploaded") {
      this.lmsgs = [];
      this.lmsgs.push({ severity: 'error', summary: 'Error Message', detail: "something went worng Please upload aggain" });
      setTimeout(() => {
        this.msgs = [];
      }, 3000)
    }

  }

  get f() { return this.data.controls; }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    } else if (this.submitted && this.f.email.errors && (type == 'email')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.first_name.errors && (type == 'fname')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.last_name.errors && (type == 'lname')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.phone_no.errors && (type == 'phone_no')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.zip_code.errors && (type == 'zip_code')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.address_line.errors && (type == 'address_line')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.city.errors && (type == 'city')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.state.errors && (type == 'state')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.country.errors && (type == 'country')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  onSubmit() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    this.data.value["country_id"] = this.countryId.toString();
    this.data.value["state_id"] = this.stateId.toString();
    this.data.value["city_id"] = this.cityId.toString();
    this.token = localStorage.getItem("token");
    this.profileService.profile_update(this.data.value, this.token).subscribe((response: any) => {
      if (response.status == 200) {
        $("html, body").animate({ scrollTop: 0 }, 1000);
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.msgs = [];
        }, 3000)
      }
      this.spinner.hide();
    }, (err) => {
      $("html, body").animate({ scrollTop: 0 }, 1000);
      this.spinner.hide();
      console.log(err);
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
      setTimeout(() => {
        this.msgs = [];
      }, 5000)
    })
  }

  getCountry() {
    this.spinner.show();
    this.commonService.getCountry().subscribe((response: any) => {
      if (response.status == 200) {
        var array: any = response["country"];
        var temp = [];
        for (let i = 0; i < array.length; i++) {
          temp.push({ id: array[i].id, description: array[i].name });
        }
        this.dropdownOptions = temp;
        if (this.getCountryValue) {
          for (let i = 0; i < this.dropdownOptions.length; i++) {
            if (this.dropdownOptions[i].id == this.countryId) {
              this.countryId = this.dropdownOptions[i].id;
              this.data.patchValue({ 'country': this.dropdownOptions[i].description });
            }
          }
          this.getState();
        }
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }

  getState() {
    this.spinner.show();
    this.commonService.getState(this.countryId).subscribe((response: any) => {
      if (response.status == 200) {
        var array: any = response["state"];
        var temp = []
        for (let i = 0; i < array.length; i++) {
          temp.push({ id: array[i].id, description: array[i].name });// countryId: array[i].country_id
        }
        this.dropdownOptions1 = temp;
        if (this.getStateValue) {
          for (let i = 0; i < this.dropdownOptions1.length; i++) {
            if (this.dropdownOptions1[i].id == this.stateId) {
              this.stateId = this.dropdownOptions1[i].id;
              this.data.patchValue({ 'state': this.dropdownOptions1[i].description });
            }
          }
        }
      }
      this.getCity();
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }

  getCity() {
    this.spinner.show();
    this.commonService.getCity(this.stateId).subscribe((response: any) => {
      if (response.status == 200) {
        var array: any = response["city"];
        var temp = []
        for (let i = 0; i < array.length; i++) {
          temp.push({ id: array[i].id, description: array[i].name });//stateId: array[i].state_id
        }
        this.dropdownOptions2 = temp;
        if (this.getStateValue) {
          for (let i = 0; i < this.dropdownOptions2.length; i++) {
            if (this.dropdownOptions2[i].id == this.cityId) {
              this.cityId = this.dropdownOptions2[i].id;
              this.data.patchValue({ 'city': this.dropdownOptions2[i].description });
            }
          }
        }
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      this.spinner.hide();
    })
  }

  selectionCountryChanged(e) {
    this.location.state = "";
    this.location.city = "";
    $(".state-container button span").first().text('Select State');
    $(".state-container button span").first().next().text('');

    $(".city-container button span").first().text('Select City');
    $(".city-container button span").first().next().text('');

    this.dis_city = true;
    if (e.value) {
      this.data.patchValue({
        country: e.value.description,
        state: "",
        city: ""
      });
      this.dis_state = false;
      this.countryId = e.value.id;
      this.getState();
      this.dropdownOptions2 = [];
    } else {
      this.data.patchValue({
        country: "",
        state: "",
        city: ""
      });
      this.dis_state = true;
      this.dropdownOptions1 = [];
      this.dropdownOptions2 = [];

      this.model_city = e.value;
      this.model_state = "";
    }
  }

  selectionStateChanged(e) {
    $(".city-container button span").first().text('Select City');
    this.location.city = "";
    if (e.value) {
      this.data.patchValue({
        state: e.value.description,
        city: ""
      });
      this.stateId = e.value.id;
      $(".state-container button span").first().text(e.value.description);
      this.dis_city = false;
      this.getCity();
    } else {
      this.data.patchValue({
        state: "",
        city: ""
      });
      $(".state-container button span").first().text("Select State");
      this.dis_city = true;
      this.dropdownOptions2 = [];
    }
  }
  selectionChanged(e) {
    if (e.value) {
      this.cityId = e.value.id;
      this.data.patchValue({
        city: e.value.description,
      });
      $(".city-container button span").first().text(e.value.description);
    }
  }

}