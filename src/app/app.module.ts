import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* COMPONENTS */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationbarComponent } from './components/navigationbar/navigationbar.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ListingComponent } from './components/listing/listing.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AddListingComponent } from './components/add-listing/add-listing.component';
import { MyExtensionsComponent } from './components/my-extensions/my-extensions.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { ViewUserComponent } from './components/view-user/view-user.component';

/* SERVICES */
import { Image100x100 } from './PipeTransform/image-100x100';
import { Image250x250 } from './PipeTransform/image-250x250';
import { Image500x500 } from './PipeTransform/image-500x500';
import { SharedService } from './services/shared.service';

/* THIRD PARTY LIBRARIES */
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { NgxPaginationModule } from 'ngx-pagination';
import { DataViewModule } from 'primeng/dataview';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import {InputMaskModule} from 'primeng/inputmask';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from "ngx-spinner";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {MessagesModule} from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {StepsModule} from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextMaskModule } from 'angular2-text-mask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SimplebarAngularModule } from 'simplebar-angular';

let config = new AuthServiceConfig([
  //{
    //id: GoogleLoginProvider.PROVIDER_ID,
    //provider: new GoogleLoginProvider('298434765938-ee8q1ntugfcmd6kqk3s07noecdogdme6.apps.googleusercontent.com') //for localhost
    //provider: new GoogleLoginProvider('213481034438-3un7rjn0u9squ1u0j424pcseb36pj92m.apps.googleusercontent.com') //for developermode/live
  //},
/*   {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("232937881244232")
  } */
]);
 
export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    HeaderComponent,
    NavigationbarComponent,
    SignUpComponent,
    ListingComponent,
    NavigationComponent,
    CategoryListComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    EditProfileComponent,
    ForgotPasswordComponent,
    AddListingComponent,
    MyExtensionsComponent,
    EditListingComponent,
    ViewUserComponent,
    Image100x100,
    Image250x250,
    Image500x500
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocialLoginModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    DataViewModule,
    FileUploadModule,
    DialogModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TabViewModule,
    InputMaskModule,
    SelectDropDownModule,
    MessagesModule,
    MessageModule,
    StepsModule,
    CalendarModule,
    TableModule,
    MultiSelectModule,
    TextMaskModule,
    ProgressSpinnerModule,
    SimplebarAngularModule
  ],
  providers: [
    LoginComponent,
    SharedService,
    CookieService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }