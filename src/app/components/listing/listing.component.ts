import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import sweetAlert from 'sweetalert2';
import * as $ from 'jquery';

import { CounterOfferService } from '../../services/counte-offer-service';
import { MyextensionDetailService } from '../../services/my-extension-detail.service';
import { SubmitOfferService } from '../../services/submit-offer.service';
import { SendBuyerMessageService } from '../../services/send-buyer-message.service';
import { ExpireTokenService } from '../../services/expire-token.service';
import { SharedService } from '../../services/shared.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("userDetail"));
  loader: boolean = false;
  detail_tab: boolean = true;
  offers_tab: boolean = false;
  submited_offers_tab: boolean = false;
  message_tab: boolean = false;
  mannage_tab: boolean = false;

  grant_access: boolean = true;
  sold_inproccess_buton: boolean = false;
  loginFirst: boolean = false;
  noList_spinnerActive: boolean = false;
  noList_spinnerActive_mannage_access: boolean = false;
  buyer_seller_submit: boolean = false;
  detail_tab_toggle: boolean = true;
  offers_tab_toggle: boolean = true;
  offers_tab_submited: boolean = false;
  message_tab_toggle: boolean = false;
  mannage_tab_toggle: boolean = true;

  country_code: any = "in";
  buyer_id: String = "";
  average_offer: any;
  sold_inproccess_buton_text: any;
  seller_id_boolean_submit: boolean = false;
  seller_id_boolean_message: boolean = false;
  buyer_id_boolean: boolean = false;
  displayStatsImagesModal: boolean;
  displayStatsImagesModal_chat: boolean;
  visiblity: boolean;
  submitted = false;
  firstLoad = true;
  submitted_1 = false;
  firstLoad_1 = true;
  submitted_2 = false;
  firstLoad_2 = true;
  store_url;
  receiver_id;
  lastChat_id;
  receiver_id_buyer;
  otherPartyName;
  send_message;
  product_name;
  product_type;
  token;
  id;
  total_user;
  product_created_date;
  website;
  status;
  currency;
  price;
  update_date_ason;
  amount_counter
  seller_name;
  negotiate;
  location;
  member_since;
  total_listings;
  sold_listings;
  description;
  userbase: any = [];
  chatdetails: any = [];
  profile_image;
  empty_image;
  empty_image_array: any = [];
  banner_image_active;
  banner_image: any = [];
  statistics_image_active;
  statistics_images: any = [];
  data: FormGroup;
  data_1: FormGroup;
  data_2: FormGroup;

  msgs: Message[] = [];
  lmsgs: Message[] = [];
  lmmsgs: Message[] = [];
  Chmsgs: Message[] = [];
  offer_accept_Error_msgs: Message[] = [];
  request_Error_msgs: Message[] = [];

  counter_offer_amount: Number;
  counter_offer_id: String;
  manage_access_array: any = [];
  offers_tab_array: any = [];
  send_offers_tab_array: any = {};
  offers_tab_length: Number = 0;
  constructor(
    private myextensionDetailService: MyextensionDetailService,
    private chatService: ChatService,
    private counterOfferService: CounterOfferService,
    private submitOfferService: SubmitOfferService,
    private sendBuyerMessageService: SendBuyerMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private expireTokenService: ExpireTokenService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.data = this.formBuilder.group({
      amount: ['', Validators.required],
      terms_condition: ['', Validators.required],
    });
    this.data_1 = this.formBuilder.group({
      message: ['', Validators.required],
    });
    this.data_2 = this.formBuilder.group({
      amount_counter: ['', Validators.required],
    });
    this.empty_image = "assets/images/empty_carousel.png",
      this.empty_image_array = [
        { "id": 2, "image_path": "assets/images/empty_carousel.png" },
        { "id": 3, "image_path": "assets/images/empty_carousel.png" },
      ]
    this.profile_image = "assets/images/emptyImage.png",
      this.visiblity = true,
      this.store_url = '',
      this.product_name = '',
      this.product_type = '',
      this.manage_access_array = [],
      this.offers_tab_array = [];
    this.send_offers_tab_array = {};
  }

  get f() { return this.data.controls; }
  get g() { return this.data_1.controls; }
  get h() { return this.data_2.controls; }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    this.sharedService.sharedMessage.subscribe((values: any) => {
      this.product_name = values.product_name,
        this.product_type = values.product_type,
        this.store_url = values.store_url,
        this.visiblity = values.visiblity
    })
    this.getProductCategory();
  }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.amount.errors && (type == 'amount')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.terms_condition.errors && (type == 'terms_condition')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  classForValidation_1(type) {
    if (this.firstLoad_1) {
      return
    }
    else if (this.submitted_1 && this.g.message.errors && (type == 'message')) {
      return 'is-invalid';
    }
    else if ((type == 'request_extension') && this.submitted_1 && this.g.request_extension.errors) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  classForValidation_2(type) {
    if (this.firstLoad_2) {
      return
    }
    else if (this.submitted_2 && this.h.amount_counter.errors && (type == 'amount_counter')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  submit() {
    if (this.loginFirst) {
      this.lmsgs = [];
      this.lmsgs.push({ severity: 'error', summary: 'Error Message', detail: "Login first to submit offer" });
      setTimeout(() => {
        this.lmsgs = [];
      }, 3000)
      return
    }
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    var data = {
      "product_id": this.id,
      "offer_amount": this.data.value.amount
    }
    this.token = localStorage.getItem("token");
    this.submitOfferService.sumitOffer(this.token, data).subscribe((response: any) => {
      if (response.status == true) {
        this.buyer_seller_submit = true;
        this.buyer_id_boolean = true;
        this.offers_tab_toggle = false;
        this.offers_tab_submited = true;
        this.message_tab_toggle = true;
        this.mannage_tab_toggle = false;
        this.price = response.my_offer.asking_price;
        this.offers_tab_length = response.my_offer.total_offer;
        this.average_offer = response.my_offer.avg_offers;
        this.send_offers_tab_array = response.my_offer["buyer-details"];
        this.data.patchValue({ "amount": response.my_offer["buyer-details"].offered_amount });
        this.lmsgs = [];
        this.lmsgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.lmsgs = [];
        }, 3000)
        this.spinner.hide();
      } else if (response.status == false) {
        this.lmsgs = [];
        this.lmsgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.lmsgs = [];
        }, 3000)
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  submit_1() {
    if (this.loginFirst) {
      this.lmmsgs = [];
      this.lmmsgs.push({ severity: 'error', summary: 'Error Message', detail: this.visiblity == false ? "Login first to get access" : "Login first to send message" });
      setTimeout(() => {
        this.lmmsgs = [];
      }, 3000)
      return
    }
    this.spinner.show();
    this.firstLoad_1 = false;
    this.submitted_1 = true;
    if (this.data_1.invalid) {
      this.spinner.hide();
      return;
    }
    this.token = localStorage.getItem("token");
    var data = {
      "product_id": this.id,
      "message": this.data_1.value.message,
      "grant_access": this.data_1.value.request_extension == false || this.data_1.value.request_extension == null ? "0" : "1"
    }
    this.sendBuyerMessageService.sendBuyerMessage(this.token, data).subscribe((response: any) => {
      if (response.status == true) {
        this.lmmsgs = [];
        this.lmmsgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.lmmsgs = [];
        }, 3000)
        this.spinner.hide();
      } else if (response.status == false) {
        this.lmmsgs = [];
        this.lmmsgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.lmmsgs = [];
        }, 3000)
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  showCounterOfferAmount(amount, id) {
    this.counter_offer_amount = parseInt(amount);
    this.counter_offer_id = id;
    this.displayStatsImagesModal = true;
  }

  submit_2() {
    if (this.data_2.value.amount_counter) {
      this.firstLoad_2 = true;
      if (this.counter_offer_amount >= this.data_2.value.amount_counter) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: "Counter amount should be greter that offer amount" });
        setTimeout(() => {
          this.msgs = [];
        }, 2500)
        return
      }
    }
    this.spinner.show();
    this.firstLoad_2 = false;
    this.submitted_2 = true;
    if (this.data_2.invalid) {
      this.spinner.hide();
      return;
    }
    var data = {
      "offer_id": this.counter_offer_id,
      "counter_offer": this.data_2.value.amount_counter
    }
    this.counterOfferService.counterOffer(this.token, data).subscribe((response: any) => {
      if (response.status == 200) {
        this.lmmsgs = [];
        this.lmmsgs.push({ severity: 'success', summary: 'Success Message', detail: response.message });
        setTimeout(() => {
          this.lmmsgs = [];
        }, 3000)
        this.spinner.hide();
      } else if (response.status == 404) {
        this.lmmsgs = [];
        this.lmmsgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.lmmsgs = [];
        }, 3000)
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  checkbox_submitoffer_change() {
    if ($('input#exampleCheck1').is(':checked')) {
      this.data.setValue({
        "terms_condition": true,
        "amount": this.data.value.amount
      });
    } else {
      this.data.patchValue({
        "terms_condition": '',
        "amount": this.data.value.amount
      });
    }
  }

  checkbox_change() {
    if ($('input#exampleCheck1_1').is(':checked')) {
      this.data_1.setValue({
        "request_extension": true,
        "message": this.data_1.value.message
      });
    } else {
      this.data_1.patchValue({
        "request_extension": '',
        "message": this.data_1.value.message
      });
    }
  }

  getProductCategory() {
    this.spinner.show();
    this.token = localStorage.getItem("token");
    this.myextensionDetailService.getExtensionDetail(this.token, this.id).subscribe((response: any) => {
      if (response.status == 200) {
        var user_detail_from_strorage = localStorage.getItem("userDetail");
        var user_detail = JSON.parse(user_detail_from_strorage);
        this.status = this.status_Check(response.product.status);
        this.visiblity = response.product.visibilty == "0" ? true : false;
        if (!this.visiblity) {
          this.data_1 = this.formBuilder.group({
            message: ['', Validators.required],
            request_extension: ['', Validators.required],
          });
          this.grant_access = false;
        }
        if (response.product.status == "3" || response.product.status == "4") {
          this.sold_inproccess_buton = true;
          this.sold_inproccess_buton_text = "Sold";
          this.seller_id_boolean_submit = true;
          this.seller_id_boolean_message = true;
        } else if (response.product.status == "2") {
          this.sold_inproccess_buton = true;
          this.sold_inproccess_buton_text = "In Progress";
          this.seller_id_boolean_submit = true;
          this.seller_id_boolean_message = false;
        }
        if (response.product.send_offers) {
          var length = Object.keys(response.product.send_offers).length;
          if (length > 0) {
            this.buyer_seller_submit = true;
            this.offers_tab_toggle = false;
            this.offers_tab_submited = true;
            this.message_tab_toggle = true;
            this.mannage_tab_toggle = false;
            this.receiver_id_buyer = response.product.seller.id;
            this.price = response.product.send_offers.asking_price;
            this.offers_tab_length = response.product.send_offers.total_offer;
            this.average_offer = response.product.send_offers.avg_offers.toFixed(2);
            response.product.send_offers["buyer-details"]["offer_amount"] = response.product.send_offers["buyer-details"]["offer-amount"]
            delete response.product.send_offers["buyer-details"]["offer-amount"]
            this.send_offers_tab_array = response.product.send_offers["buyer-details"];
            var offer_amount = response.product.send_offers["buyer-details"]["offer_amount"];
            this.data.patchValue({ "amount": offer_amount });
          } else if (length == 0) {
            this.buyer_seller_submit = false;
          }
        } else if (user_detail_from_strorage) {
          if (user_detail.id == response.product.seller.id) {
            this.mannage_tab_toggle = this.visiblity ? false : true;
            this.visiblity = true;
            this.buyer_seller_submit = true;
            this.seller_id_boolean_submit = true;
            this.seller_id_boolean_message = true;
          }
        } else if (!user_detail_from_strorage) {
          this.loginFirst = true;
          this.buyer_seller_submit = false;
          this.seller_id_boolean_submit = false;
          this.seller_id_boolean_message = false;
        }

        this.userbase = response.product.userbase;
        this.description = response.product.description;
        this.store_url = response.product.store_url;
        this.product_name = response.product.product_name;
        this.product_type = response.product.type;
        this.total_user = response.product.total_users;
        this.update_date_ason = response.product.updated_date;

        var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        var product_created_date = pattern.test(response.product.product_created_date);
        this.product_created_date = response.product.product_created_date;
        if (product_created_date) {
          var product_created_date_change_format = response.product.product_created_date.replace(/\//g, "-");
          var day = product_created_date_change_format.slice(0, 2);
          var month = product_created_date_change_format.slice(3, 5);
          var year = product_created_date_change_format.slice(6, 10);
          this.product_created_date = year + "-" + month + "-" + day;
        }
        if (response.product.access) {
          if (response.product.access == "1") {
            this.visiblity = true;
            this.data_1 = this.formBuilder.group({
              message: ['', Validators.required],
            });
            this.grant_access = true;
          } else if (response.product.access == "0") {
            this.visiblity = false;
          }
        }
        this.sharedService.nextMessage(response.product.product_name, response.product.type, response.product.store_url, this.visiblity);

        this.currency = response.product.currency;
        this.website = response.product.website;
        this.price = response.product.price;
        this.seller_name = response.product.seller.name;
        this.negotiate = response.product.negotiate;

        this.country_code = response.product.seller.country_code;
        this.location = response.product.seller.country;
        this.member_since = response.product.seller.created_date;
        this.total_listings = response.product.seller.total_listings;
        this.sold_listings = response.product.seller.sold_listings;
        this.profile_image = response.product.seller.image ? response.product.seller.image : this.profile_image;
        this.banner_image_active = response.product.banners.length > 0 ? response.product.banners[0].image_path : this.empty_image;
        this.banner_image = response.product.banners.length > 0 ? response.product.banners : this.empty_image_array;
        this.statistics_image_active = response.product.statistics.length > 0 ? response.product.statistics[0].image_path : this.empty_image;
        this.statistics_images = response.product.statistics.length > 0 ? response.product.statistics : this.empty_image_array;
        this.offers_tab_array = response.product.received_offers;
        this.manage_access_array = response.product.access_request;
        if (this.manage_access_array) {
          if (this.manage_access_array.length == 0) {
            this.noList_spinnerActive_mannage_access = true
          }
        }
        if (response.product.received_offers) {
          if (response.product.received_offers.length != 0) {
            if (response.product.received_offers.length > 0) {
              this.offers_tab_length = response.product.received_offers.length;
              var sum = this.offers_tab_array.reduce((a, { offered_amount }) => parseInt(a) + parseInt(offered_amount), 0);
              var average = sum / response.product.received_offers.length;
              this.average_offer = average.toFixed(2);
            }
          } else {
            this.noList_spinnerActive = true
          }
        }
        if (this.message_tab_toggle) {
          this.getChatDetails();
        }
        this.spinner.hide();
      } else if (response.status == 400) {
        this.spinner.hide();
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

  scrollHandler(event) {
    //console.log(event);
  }

  showChatModal(id, first, last) {
    this.receiver_id = id;
    this.otherPartyName = first + " " + last;
    this.displayStatsImagesModal_chat = true;
    this.spinner.show();
    this.getChatDetails();
  }

  getChatDetails() {
    var data = {}
    if (this.message_tab_toggle) {
      data = {
        "product_id": this.id
      }
    } else {
      data = {
        "product_id": this.id,
        "third_party": this.receiver_id
      }
    }
    this.chatService.getChat(this.token, data).subscribe((response: any) => {
      if (response.status == 200) {
        if (response.chat.length > 0) {
          this.lastChat_id = response.chat[0].id;
        }
        this.chatdetails = response.chat;
        this.spinner.hide();
      } else if (response.status == 404) {
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  getMoreChatDetails() {
    this.loader = true
    var data = {
      "product_id": this.id,
      "third_party": this.receiver_id,
      "reference_id": this.lastChat_id
    }
    this.chatService.getMoreChat(this.token, data).subscribe((response: any) => {
      if (response.status == 200) {
        this.loader = false;
        if (response.chat.length > 0) {
          this.lastChat_id = response.chat[0].id;
          var previousChat = response.chat;
          var earlierChat = this.chatdetails
          this.chatdetails = previousChat.concat(earlierChat);
        }
      } else if (response.status == 404) {
      }
    }, (err) => {
      console.log(err);
    })
  }

  sendChat() {
    let user_detail_from_strorage = localStorage.getItem("userDetail");
    let user_detail = JSON.parse(user_detail_from_strorage);
    if (!this.send_message) {
      return
    }
    var data = {
      "message": this.send_message,
      "product_id": this.id,
      "sender_id": user_detail.id,
      "receiver_id": this.receiver_id ? this.receiver_id : this.receiver_id_buyer
    }
    this.chatService.storeChat(this.token, data).subscribe((response: any) => {
      if (response.status == 200) {
        this.send_message = '';
        this.getChatDetails();
      } else if (response.status == 404) {
        this.Chmsgs = [];
        this.Chmsgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.Chmsgs = [];
        }, 3000)
      }
    }, (err) => {
      console.log(err);
    })
  }

  onChange(type) {
    $("a").removeClass("active");
    if (type == 'detail_tab') {
      this.detail_tab = true;
      this.offers_tab = false;
      this.submited_offers_tab = false;
      this.message_tab = false;
      this.mannage_tab = false;
      $("#detail_tab").addClass("active");
    } else if (type == 'offers_tab') {
      this.spinner.show();
      this.detail_tab = false;
      this.offers_tab = true;
      this.submited_offers_tab = false;
      this.message_tab = false;
      this.mannage_tab = false;
      setTimeout(() => {
        this.offer_tab_action_buttons();
        this.spinner.hide();
      }, 1500)
      $("#offers_tab").addClass("active");
    } else if (type == 'submited_offers_tab') {
      this.detail_tab = false;
      this.offers_tab = false;
      this.submited_offers_tab = true;
      this.message_tab = false;
      this.mannage_tab = false;
      $("#submited_offers_tab").addClass("active");
    } else if (type == 'mannage_tab') {
      this.spinner.show();
      this.detail_tab = false;
      this.offers_tab = false;
      this.submited_offers_tab = false;
      this.message_tab = false;
      this.mannage_tab = true;
      setTimeout(() => {
        this.request_tab_action_buttons();
        this.spinner.hide();
      }, 1500)
      $("#mannage_tab").addClass("active");
    } else if (type == 'message_tab') {
      this.detail_tab = false;
      this.offers_tab = false;
      this.submited_offers_tab = false;
      this.message_tab = true;
      this.mannage_tab = false;
      $("#message_tab").addClass("active");
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

  request_tab_action_buttons() {
    var offers_tab_array_temp = [];
    offers_tab_array_temp = this.offers_tab_array.filter(function (item) {
      return item.awarded == "1";
    });
    for (let i = 0; i < this.manage_access_array.length; i++) {
      if (this.manage_access_array[i].status == "1") {
        $("#accepted_access_" + i).removeClass("d-none");
        $("#approve_" + i).addClass("d-none");
        /*  $("#reject_" + i).prop('disabled', true);
         $("#reject_" + i).css('cursor', 'not-allowed'); */
      } else if (this.manage_access_array[i].status == "2") {
        $("#rejected_access_" + i).removeClass("d-none");
        $("#reject_access_" + i).addClass("d-none");
        /*         $("#approve_" + i).prop('disabled', true);
                $("#approve_" + i).css('cursor', 'not-allowed'); */
      }
    }
    if (offers_tab_array_temp.length > 0) {
      for (let i = 0; i < this.offers_tab_array.length; i++) {
        if (this.offers_tab_array[i].username == this.manage_access_array[i].username) {
          $("#reject_access_" + i).prop('disabled', true);
          $("#reject_access_" + i).css('cursor', 'not-allowed');
          $("#approve_" + i).prop('disabled', true);
          $("#approve_" + i).css('cursor', 'not-allowed');
          $("#accepted_access_" + i).prop('disabled', true);
          $("#accepted_access_" + i).css('cursor', 'not-allowed');
        }
      }
    }
  }

  offer_tab_action_buttons() {
    var offers_tab_array_temp = [];
    offers_tab_array_temp = this.offers_tab_array.filter(function (item) {
      return item.awarded == "1";
    });
    if (offers_tab_array_temp.length > 0) {
      for (let j = 0; j < this.offers_tab_array.length; j++) {
        if (this.offers_tab_array[j].awarded != "1") {
          $("#accept_" + j).prop('disabled', true);
          $("#accept_" + j).css('cursor', 'not-allowed');

          $("#rejected_" + j).addClass("d-none");
          $("#reject_" + j).removeClass("d-none");
          $("#reject_" + j).prop('disabled', true);
          $("#reject_" + j).css('cursor', 'not-allowed');

          $("#counter_" + j).prop('disabled', true);
          $("#counter_" + j).css('cursor', 'not-allowed');
        } else {
          $("#accepted_" + j).removeClass("d-none");
          $("#accept_" + j).addClass("d-none");
          $("#reject_" + j).prop('disabled', true);
          $("#reject_" + j).css('cursor', 'not-allowed');
          $("#counter_" + j).prop('disabled', true);
          $("#counter_" + j).css('cursor', 'not-allowed');
        }
      }
    } else if (offers_tab_array_temp.length == 0) {
      for (let j = 0; j < this.offers_tab_array.length; j++) {
        if (this.offers_tab_array[j].awarded == "2") {
          $("#rejected_" + j).removeClass("d-none");
          $("#reject_" + j).addClass("d-none");
          $("#accept_" + j).prop('disabled', true);
          $("#accept_" + j).css('cursor', 'not-allowed');
          $("#counter_" + j).prop('disabled', true);
          $("#counter_" + j).css('cursor', 'not-allowed');
        }
      }
    }
  }

  show_hide_buttons_accept(i, id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Accept it!'
    }).then((result) => {
      if (result.value) {
        sweetAlert.fire(
          'Accepted!',
          'This offer is accepted.',
          'success'
        )
        this.token = localStorage.getItem("token");
        this.myextensionDetailService.acceptRequest(this.token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            this.offer_accept_Error_msgs = [];
            this.offer_accept_Error_msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
            setTimeout(() => {
              this.lmsgs = [];
            }, 3000)
            console.log(response);
          } else if (response["status"] == 200) {
            sweetAlert.fire(
              'Accepted',
              'This offer is accepted.',
              'success'
            ).then((result => {
              if (result.value) {
                $("#accepted_" + i).removeClass("d-none");
                $("#accept_" + i).addClass("d-none");
                $("#reject_" + i).prop('disabled', true);
                $("#reject_" + i).css('cursor', 'not-allowed');
                $("#counter_" + i).prop('disabled', true);
                $("#counter_" + i).css('cursor', 'not-allowed');
                for (let j = 0; j < this.offers_tab_length; j++) {
                  if (j != i) {
                    $("#accept_" + j).prop('disabled', true);
                    $("#accept_" + j).css('cursor', 'not-allowed');

                    $("#rejected_" + j).addClass("d-none");
                    $("#reject_" + j).removeClass("d-none");
                    $("#reject_" + j).prop('disabled', true);
                    $("#reject_" + j).css('cursor', 'not-allowed');

                    $("#counter_" + j).prop('disabled', true);
                    $("#counter_" + j).css('cursor', 'not-allowed');
                  }
                }
                this.offers_tab_array[i].awarded = "1";
              }
            }))
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  show_hide_buttons_reject(i, id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!'
    }).then((result) => {
      if (result.value) {
        sweetAlert.fire(
          'Rejected!',
          'This offer is rejected.',
          'success'
        )
        this.token = localStorage.getItem("token");
        this.myextensionDetailService.rejectRequest(this.token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            this.offer_accept_Error_msgs = [];
            this.offer_accept_Error_msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
            setTimeout(() => {
              this.lmsgs = [];
            }, 3000)
            console.log(response);
          } else if (response["status"] == 200) {
            sweetAlert.fire(
              'Rejected',
              'This offer is rejected.',
              'success'
            ).then((result => {
              if (result.value) {
                $("#rejected_" + i).removeClass("d-none");
                $("#reject_" + i).addClass("d-none");
                $("#accept_" + i).prop('disabled', true);
                $("#accept_" + i).css('cursor', 'not-allowed');
                $("#counter_" + i).prop('disabled', true);
                $("#counter_" + i).css('cursor', 'not-allowed');
                this.offers_tab_array[i].awarded = "2";
              }
            }))
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  approve_permission(i, id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!'
    }).then((result) => {
      if (result.value) {
        sweetAlert.fire(
          'Approved!',
          'This Permission is approved.',
          'success'
        )
        this.token = localStorage.getItem("token");
        this.myextensionDetailService.approveAccessRequest(this.token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            this.request_Error_msgs = [];
            this.request_Error_msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
            setTimeout(() => {
              this.lmsgs = [];
            }, 3000)
            console.log(response);
          } else if (response["status"] == 200) {
            sweetAlert.fire(
              'Approved',
              'This Permission is approved.',
              'success'
            ).then((result => {
              if (result.value) {
                $("#accepted_access_" + i).removeClass("d-none");
                $("#approve_" + i).addClass("d-none");
                $("#rejected_access_" + i).addClass("d-none");
                $("#reject_access_" + i).removeClass("d-none");
                this.manage_access_array[i].status = "1";
              }
            }))
            this.spinner.hide();
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  reject_permission(i, id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!'
    }).then((result) => {
      if (result.value) {
        sweetAlert.fire(
          'Rejected!',
          'This Permission is rejected.',
          'success'
        )
        this.token = localStorage.getItem("token");
        this.myextensionDetailService.rejectAccessRequest(this.token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            this.request_Error_msgs = [];
            this.request_Error_msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
            setTimeout(() => {
              this.lmsgs = [];
            }, 3000)
            console.log(response);
          } else if (response["status"] == 200) {
            sweetAlert.fire(
              'Rejected',
              'This Permission is rejected.',
              'success'
            ).then((result => {
              if (result.value) {
                $("#rejected_access_" + i).removeClass("d-none");
                $("#reject_access_" + i).addClass("d-none");
                $("#accepted_access_" + i).addClass("d-none");
                $("#approve_" + i).removeClass("d-none");
                this.manage_access_array[i].status = "2";
              }
            }))
            this.spinner.hide();
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

}
