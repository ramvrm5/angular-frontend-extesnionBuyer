import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {Message} from 'primeng/api';
import {MessageService} from 'primeng/api';
import * as $ from 'jquery';

import { OauthService } from '../../services/oauth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  data: FormGroup;
  submitted = false;
  firstLoad: boolean = true;
  msgs: Message[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private oauthService: OauthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.data = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

    });
   }

   get f() { return this.data.controls; }

   ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
   }
   
   classEmailForValidation(){
     if(this.firstLoad){
       return
     }
     else if(this.submitted && this.f.email.errors){
       return 'is-invalid'
     }else{
       return 'is-valid'
     }
   }

   sendEmail() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    this.oauthService.forgetpassword(this.data.value).subscribe((response: any) => {
      if (response.status == "true") {
        $("html, body").animate({ scrollTop: 350 }, 1000);
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Success Message', detail:response.message});
        setTimeout(() => {
          this.data.reset();
          this.firstLoad = true;
          this.classEmailForValidation();
          this.msgs = [];
        }, 3000)
      } else if (response.status == "false") {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.firstLoad = true;
          this.classEmailForValidation();
          this.msgs = [];
        }, 5000)
      }
      this.spinner.hide();
    }, (err) => {
         console.log(err);
         this.firstLoad = true;
         this.submitted = false;
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });        setTimeout(() => {
          this.msgs = [];
        }, 1000)
        this.spinner.hide();
    })
  }
}