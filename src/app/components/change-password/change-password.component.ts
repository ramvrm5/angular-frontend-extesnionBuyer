import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';
import { Message } from 'primeng/api';

import { ChangePasswordService } from '../../services/change-password.service';
import { MustMatch } from '../../services/match-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  errorMessage: any
  credential: FormGroup;
  submitted = false;
  firstLoad: boolean = true
  change;
  successmessage;
  verifying: boolean = false;
  passwordReset: any;
  token;
  msgs: Message[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ChangePasswordService,
    private spinner: NgxSpinnerService
  ) {
    this.credential = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    })
  }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  }

  get f() { return this.credential.controls; }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    } else if (this.submitted && this.f.password.errors && (type == 'password')) {
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
    this.token = localStorage.getItem("token");
    this.apiService.changePassword(this.credential.value, this.token).subscribe((response: any) => {
      if (response.status == 200) {
        $("html, body").animate({ scrollTop: 130 }, 1000);
        console.log(response);
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: "Password change successfully" });
        setTimeout(() => {
          this.firstLoad = true;
          this.credential.reset();
          this.msgs = [];
        }, 3000)
        this.spinner.hide();
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
