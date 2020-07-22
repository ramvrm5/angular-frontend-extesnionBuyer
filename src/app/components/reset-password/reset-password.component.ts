import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as $ from 'jquery';

import { OauthService } from '../../services/oauth.service';
import { MustMatch } from '../../services/match-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  credential: FormGroup;
  submitted = false;
  firstLoad: boolean = true
  change;
  message;
  verifying: boolean = false;
  passwordReset: any;
  token;
  msgs: Message[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private oauthService: OauthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.token = localStorage.getItem("token");
    this.credential = this.formBuilder.group({
      resetPasswordToken: '',
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    })
  }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  }

  get f() { return this.credential.controls; }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    } else if (this.submitted && this.f.newPassword.errors && (type == 'newPassword')) {
      return 'is-invalid';
    } else if (this.submitted && this.f.confirmPassword.errors && (type == 'confirmPassword')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  onSubmit() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.credential.invalid) {
      this.spinner.hide();
      return;
    }
    this.activatedRoute.params.subscribe(params => {
      this.credential.value.resetPasswordToken = params['key'].substr(1);
    });
    this.oauthService.resetpassword(this.credential.value).subscribe((response: any) => {
      if (response.message == "This password reset token is invalid.") {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: "Password change successfull Redirecting to Login..." });
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 3000);
        console.log(response);
        this.spinner.hide();
      } else if (response.statusCode == 404) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
        setTimeout(() => {
          this.msgs = [];
        }, 5000)
      }
    }, (err) => {
      console.log(err);
      this.firstLoad = true;
      this.submitted = false;
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });
      setTimeout(() => {
        this.msgs = [];
      }, 3000)
      this.spinner.hide();
    })
  }

}
