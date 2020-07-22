import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { Router, ActivatedRoute } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { NgxSpinnerService } from "ngx-spinner";
import {Message} from 'primeng/api';
import {MessageService} from 'primeng/api';
import * as $ from 'jquery';

import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [MessageService]
})
export class SignUpComponent implements OnInit {

  data: FormGroup;
  submitted = false;
  firstLoad: boolean = true
  emailAlreadyExist: boolean = false
  emailExist
  googleData:any;
  msgs: Message[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: OauthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.data = this.formBuilder.group({
      login_type: "web",
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  }

  get f() { return this.data.controls; }  

  classForValidation(type){
    if(this.firstLoad){
      return
    }
    else if(this.submitted && this.f.password.errors && (type == 'password')) {
      return 'is-invalid';
    }else if((this.submitted && this.f.email.errors && (type == 'email'))|| (this.submitted && (type == 'email') && this.emailAlreadyExist)){
      return 'is-invalid';
    }else if(this.submitted && this.f.first_name.errors && (type == 'fname')){
      return 'is-invalid';
    }else if(this.submitted && this.f.last_name.errors && (type == 'lname')){
      return 'is-invalid';
    }else{
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
      this.apiService.signUpUser(this.data.value).subscribe((response: any) => {
      if (response.message == "Registration Successfully.") {
        this.emailAlreadyExist = false;
        this.router.navigate(['login']);
      } 
      this.spinner.hide();
    }, (err) => {
        this.emailAlreadyExist = true;
        this.emailExist = err.error.error.email[0];
        //this.emailExist = "The email has already been taken.";
        this.spinner.hide();
        console.log(err);
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: err.error.error });        setTimeout(() => {
          this.msgs = [];
        }, 3000)
        this.spinner.hide();
    })
  }

/*   signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data =>
      this.googleSubmit(data)
    );
  }

  googleSubmit(data){
    this.spinner.show();
    this.googleData = {
      "email":data.email,
      "first_name":data.firstName,
      "last_name":data.lastName,
      "login_type":"google",
    }
      this.apiService.GoogleloginUser(this.googleData).subscribe((response: any) => {
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        this.router.navigate(['home']);
      }
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  } */

/*   signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } */
}
