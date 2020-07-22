import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { OauthService } from '../../services/oauth.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  /* providers: [MessageService] */
})
export class LoginComponent implements OnInit {
  headerCokkiee: boolean = true;
  message: any;
  data: FormGroup;
  googleData: any;
  submitted = false;
  tokenBollean: boolean = false;
  firstLoad: boolean = true;
  msgs: Message[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private OauthService: OauthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    /* private messageService: MessageService */
  ) {
    this.data = this.formBuilder.group({
      KeepMeLoggedIn: "",
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }

  get f() { return this.data.controls; }

  ngOnInit() {
  }

  forCookie() {
    if (document.cookie) {
      if (document.cookie.split(";")[0].split("=")[0] == "email" || document.cookie.split(";")[1].split("=")[1] == "password") {
        this.headerCokkiee = false;
        this.data.value.email = document.cookie.split(";")[0].split("=")[1];
        this.data.value.password = document.cookie.split(";")[1].split("=")[1];
        if (this.data.value.email != "" && this.data.value.password !="") { 
          this.signIn();
        }
      }
    }
  }

  classEmailForValidation() {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.email.errors) {
      return 'is-invalid'
    } else {
      return 'is-valid'
    }
  }

  classPasswordForValidation() {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.password.errors) {
      return 'is-invalid'
    } else {
      return 'is-valid'
    }
  }

  signIn() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.headerCokkiee == true) {
      if (this.data.invalid) {
        this.spinner.hide();
        return;
      }
    }

    this.OauthService.loginUser(this.data.value).subscribe((response: any) => {
      if (response.access_token) {
        if (this.data.value.KeepMeLoggedIn) {
          var now = new Date();
          var time = now.getTime();
          var expireTime = time + 7 * 24 * 60 * 60 * 1000;
          now.setTime(expireTime);
          document.cookie = "email=" + this.data.value.email + ';expires=' + now.toUTCString() + ';path=/';
          document.cookie = "password=" + this.data.value.password + ';expires=' + now.toUTCString() + ';path=/';
        }
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("userDetail", JSON.stringify(response.user));
        this.router.navigate(['dashboard']);
      }
      this.spinner.hide();
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

  /*   signInWithGoogle(): void {
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data =>
        this.googleSubmit(data)
      );
    } */

  /*   signInWithFB(): void {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    } */

  /*   googleSubmit(data){
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
}
